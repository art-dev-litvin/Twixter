import { routes } from "../../constants/routes";
import { useAuth } from "../../contexts/auth/Auth.hook";
import Avatar from "../Avatar";
import NavLink from "../NavLink";

function Header() {
  const { user } = useAuth();

  return (
    <header className="bg-emerald-300 shadow-sm">
      <div className="container px-3 m-auto h-18 flex items-center ">
        <h2 className="text-2xl uppercase tracking-wider font-bold mr-16">
          <NavLink disableHoverUnderline to={routes.home}>
            twixter
          </NavLink>
        </h2>
        <nav className="grow">
          <ul>
            <li>
              <NavLink to="#">Profile</NavLink>
            </li>
          </ul>
        </nav>
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <p>
                Welcome, <span className="font-bold">{user.displayName}</span>
              </p>
              <Avatar />
            </>
          ) : (
            <>
              <NavLink to={routes.signIn}>Sign in</NavLink>
              <div className="h-6 w-[2px] bg-black" />
              <NavLink to={routes.signUp}>Sign up</NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
