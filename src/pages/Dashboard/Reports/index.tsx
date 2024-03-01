import { Link } from 'react-router-dom'

export default function Reports() {
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Reports</h1>
      <div>
        <Link to="/dashboard/tasks">Tasks</Link>
      </div>
    </div>
  )
}
