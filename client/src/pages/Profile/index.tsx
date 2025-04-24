import { useAuth } from "../../contexts/auth/Auth.hook";
import UserProfileLayout from "../../components/UserProfileLayout";
import { useLocation, useParams } from "react-router-dom";
import { routes } from "../../constants/routes";
import { User } from "firebase/auth";
import React from "react";
import { getUserById } from "../../services/api-requests/auth/getUserById";
import { handleResultWithToast } from "../../utils/handleResultWithToast";

function Profile() {
  const location = useLocation();
  const userId = useParams().id;
  const { user: currentUser, isUserLoading: isCurrentUserLoading } = useAuth();
  const [user, setUser] = React.useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = React.useState(true);
  const isMyProfilePage = location.pathname === routes.profile;

  React.useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        const result = await getUserById(userId);

        setIsUserLoading(false);

        const user = handleResultWithToast(result);

        if (user) {
          setUser(user);
        }
      }
    };

    if (!isMyProfilePage) {
      fetchUser();
    } else {
      setIsUserLoading(false);
    }
  }, [userId, isMyProfilePage]);

  const isOwner = isMyProfilePage || currentUser?.uid === user?.uid;

  if (isCurrentUserLoading || isUserLoading) {
    return <h3 className="text-lg animate-pulse">Fetching user...</h3>;
  }

  if (isMyProfilePage && !currentUser) {
    return <h3 className="text-lg">You are not authorized</h3>;
  }

  if (!isMyProfilePage && !user) {
    return <h3 className="text-lg">User not found :(</h3>;
  }

  return (
    <div>
      <h1 className="text-4xl text-center font-bold mb-6">
        {isOwner ? "Your profile" : `${user?.displayName} profile`}
      </h1>
      <UserProfileLayout
        user={isMyProfilePage ? currentUser! : user!}
        isOwner={isOwner}
      />
    </div>
  );
}

export default Profile;
