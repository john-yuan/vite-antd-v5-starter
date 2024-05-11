import { useCurrentUser } from '@/hooks/useCurrentUser'
import { createModalRef, useModal } from '@/hooks/useModal'
import { Button } from 'antd'

export default function Modals() {
  const showModal = useModal()

  console.log('Modals')

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          const ref = createModalRef()
          showModal({
            ref,
            title: 'Current user',
            children: <Profile />,
            width: 450,
            cancelButtonProps: {
              style: { display: 'none' }
            },
            okText: 'Close',
            onOk: () => {
              ref.destroy()
            }
          })
        }}
      >
        Show current user with Modal
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
