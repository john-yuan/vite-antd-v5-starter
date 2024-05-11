import { Link } from 'react-router-dom'

export default function Links() {
  return (
    <div>
      <h1>Links</h1>
      <ul>
        <li>
          <Link to="/examples/drawers">Drawers</Link>
        </li>
        <li>
          <Link to="/examples/modals">Modals</Link>
        </li>
      </ul>
    </div>
  )
}
