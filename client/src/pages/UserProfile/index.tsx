import { TPost } from "../../types/post";
import React from "react";
import { getPostsByUser } from "../../services/api-requests/posts/getPostsByUser";
import UserProfileLayout from "../../components/UserProfileLayout";
import { getUserById } from "../../services/api-requests/auth/getUserById";
import { useParams } from "react-router-dom";
import { User } from "firebase/auth";
import { handleResultWithToast } from "../../utils/handleResultWithToast";

function UserProfile() {
  const params = useParams();
  const [userPosts, setUserPosts] = React.useState<TPost[]>([]);
  const [user, setUser] = React.useState<User | null>(null);
  const userId = React.useMemo(() => params.id, [params.id]);

  React.useEffect(() => {
    if (user) {
      const fetchUserPosts = async () => {
        const result = await getPostsByUser(user.uid);

        const posts = handleResultWithToast(result);
        if (posts) {
          setUserPosts(posts);
        }
      };

      fetchUserPosts();
    }
  }, [user]);

  React.useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        const result = await getUserById(userId);

        const user = handleResultWithToast(result);

        if (user) {
          setUser(user);
        }
      }
    };

    fetchUser();
  }, [userId]);

  if (!user) {
    return (
      <div>
        <h1>Error, user not found!</h1>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl text-center font-bold mb-6">
        {user.displayName} profile
      </h1>
      <UserProfileLayout posts={userPosts} user={user} />
    </div>
  );
}

export default UserProfile;
