import { Link } from 'react-router-dom'

export default function Tasks() {
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Tasks</h1>
      <div>
        <Link to="/dashboard/reports">Reports</Link>
      </div>
    </div>
  )
}
