import classNames from "classnames";
import Avatar from "../Avatar";
import RemoveAccount from "../RemoveAccount";
import Button from "../Button";
import { routes } from "../../constants/routes";
import PostsGrid from "../PostsGrid";
import { User } from "firebase/auth";
import { TPost } from "../../types/post";
import { useAuth } from "../../contexts/auth/Auth.hook";

interface UserProfileLayoutProps {
  user: User;
  posts: TPost[];
}

function UserProfileLayout({ user, posts }: UserProfileLayoutProps) {
  const { user: currentUser } = useAuth();

  return (
    <>
      <div className="mb-4 flex gap-4">
        <Avatar src={user.photoURL || undefined} size={100} />
        <div>
          <p className="text-4xl font-medium">{user.displayName || "User"}</p>
          <p
            className={classNames("text-lg mt-1 text-gray-500", {
              "text-green-500": user?.emailVerified,
            })}>
            {user?.emailVerified ? "Email Verified" : "Email Not Verified"}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2 mb-6">
        <p className="text-xl">
          <span className="font-bold">Email:</span> {user.email}
        </p>
        <p className="text-xl">
          <span className="font-bold">Created posts:</span> {0}
        </p>
      </div>
      {currentUser && currentUser.uid === user.uid && (
        <div className="flex gap-4">
          <Button to={routes.editProfile} variant="gray">
            Edit profile
          </Button>
          <RemoveAccount />
        </div>
      )}
      <div className="mt-12 pt-12 border-t border-slate-200">
        <PostsGrid posts={posts} />
      </div>
    </>
  );
}

export default UserProfileLayout;
