import { useRouter } from "next/router";
import navBar from "../sass/components/NavBar.module.scss";

function NavBar({ title, children }) {
  const router = useRouter();
  return (
    <nav className={navBar["navbar"]}>
      <div onClick={() => router.push("/")} className={navBar["navbar__logo"]}>
        {title}
      </div>
      {children}
    </nav>
  );
}

export default NavBar;
