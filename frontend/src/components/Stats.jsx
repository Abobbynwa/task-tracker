export default function Stats({ stats }) {
  return (
    <div>
      <h3>📊 Stats</h3>
      <ul>
        <li>Total: {stats.total}</li>
        <li>✅ Done: {stats.done}</li>
        <li>🔄 In Progress: {stats.in_progress}</li>
        <li>📝 To Do: {stats.todo}</li>
      </ul>
    </div>
  );
}
