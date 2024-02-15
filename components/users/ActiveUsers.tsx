import { useOthers, useSelf } from "@/liveblocks.config"
import { Avatar } from "./Avatar"
import styles from "./index.module.css"
import { generateRandomName } from "@/lib/utils"
import { useMemo } from "react"

export default function ActiveUsers() {
  const users = useOthers()
  const currentUser = useSelf()

  const memoizedUsers = useMemo(
    () => (
      <div className="flex items-center justify-center gap-1">
        <div className="flex pl-3">
          {currentUser && (
            <Avatar
              otherStyles="border-[3px] border-solid border-primary-green"
              name="You"
            />
          )}

          {users.slice(0, 3).map(({ connectionId, info }) => {
            return (
              <Avatar
                key={connectionId}
                name={generateRandomName()}
                otherStyles="-ml-3"
              />
            )
          })}

          {users.length > 3 && (
            <div className={styles.more}>+{users.length - 3}</div>
          )}
        </div>
      </div>
    ),
    [users.length]
  )

  return memoizedUsers
}
