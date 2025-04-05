from auth import auth_required, register_routes
from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

TASKS_FILE = 'tasks.json'
STATUS_OPTIONS = ['todo', 'in-progress', 'done']

# ========== UTILS ==========

def load_tasks():
    if not os.path.exists(TASKS_FILE):
        return []
    with open(TASKS_FILE, 'r') as f:
        return json.load(f)

def save_tasks(tasks):
    with open(TASKS_FILE, 'w') as f:
        json.dump(tasks, f, indent=4)

def generate_task_id(tasks):
    return max((task['id'] for task in tasks), default=0) + 1

def validate_due_date(due_date):
    try:
        if due_date:
            datetime.strptime(due_date, "%Y-%m-%d")
        return True
    except ValueError:
        return False

@app.before_request
def log_request():
    print(f"[REQ] {request.method} {request.path} ➜ {request.json if request.is_json else ''}")

# ========== ROUTES ==========

@app.route('/tasks', methods=['GET'])
@auth_required
def get_tasks():
    user_id = request.user['id']
    tasks = [t for t in load_tasks() if t['user_id'] == user_id]
    status = request.args.get('status')
    search = request.args.get('search')

    if status:
        tasks = [t for t in tasks if t['status'] == status]
    if search:
        tasks = [t for t in tasks if search.lower() in t['title'].lower()]
    return jsonify(tasks)

@app.route('/tasks/stats', methods=['GET'])
@auth_required
def get_stats():
    user_id = request.user['id']
    tasks = [t for t in load_tasks() if t['user_id'] == user_id]
    return jsonify({
        'total': len(tasks),
        'done': len([t for t in tasks if t['status'] == 'done']),
        'in_progress': len([t for t in tasks if t['status'] == 'in-progress']),
        'todo': len([t for t in tasks if t['status'] == 'todo'])
    })

@app.route('/tasks', methods=['POST'])
@auth_required
def create_task():
    user_id = request.user['id']
    tasks = load_tasks()
    data = request.get_json()

    title = data.get('title', '').strip()
    due_date = data.get('due_date', '').strip()

    if not title:
        return jsonify({'error': 'Title is required'}), 400

    if due_date and not validate_due_date(due_date):
        return jsonify({'error': 'Invalid due_date format. Use YYYY-MM-DD'}), 400

    task = {
        'id': generate_task_id(tasks),
        'user_id': user_id,  # 🧠 attach task to current user
        'title': title,
        'status': 'todo',
        'due_date': due_date
    }

    tasks.append(task)
    save_tasks(tasks)
    return jsonify(task), 201

@app.route('/tasks/<int:task_id>', methods=['PUT'])
@auth_required
def update_task(task_id):
    user_id = request.user['id']
    tasks = load_tasks()
    task = next((t for t in tasks if t['id'] == task_id and t['user_id'] == user_id), None)

    if not task:
        return jsonify({'error': 'Task not found'}), 404

    data = request.get_json()
    task['title'] = data.get('title', task['title'])
    task['status'] = data.get('status', task['status'])
    task['due_date'] = data.get('due_date', task['due_date'])

    if task['due_date'] and not validate_due_date(task['due_date']):
        return jsonify({'error': 'Invalid due_date format. Use YYYY-MM-DD'}), 400

    save_tasks(tasks)
    return jsonify(task)

@app.route('/tasks/<int:task_id>', methods=['DELETE'])
@auth_required
def delete_task(task_id):
    user_id = request.user['id']
    tasks = load_tasks()
    new_tasks = [t for t in tasks if not (t['id'] == task_id and t['user_id'] == user_id)]

    if len(new_tasks) == len(tasks):
        return jsonify({'error': 'Task not found'}), 404

    save_tasks(new_tasks)
    return jsonify({'message': f'Task {task_id} deleted'})

# ========== STARTUP ==========

if __name__ == '__main__':
    print("🚀 Task Tracker Backend Running at http://localhost:5000")
    register_routes(app)
    app.run(debug=True)
