import { useCurrentUser } from '@/hooks/useCurrentUser'
import { createDrawerRef, useDrawer } from '@/hooks/useDrawer'
import { Button } from 'antd'

export default function Drawers() {
  const showDrawer = useDrawer()

  console.log('Drawers')

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          const ref = createDrawerRef()
          showDrawer({
            ref,
            title: 'Current user',
            children: <Profile />,
            width: 600
          })
        }}
      >
        Show current user with Drawer
      </Button>
    </div>
  )
}

function Profile() {
  const user = useCurrentUser()

  return (
    <div>
      <div>
        id: <b>{user.id}</b>
      </div>
      <div>
        account: <b>{user.account}</b>
      </div>
      <div>
        nickname: <b>{user.nickname}</b>
      </div>
    </div>
  )
}
