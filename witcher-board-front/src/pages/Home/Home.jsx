import { useWitcher } from "../../useWitcher";
import HomeView from "./HomeView";

/**
 * Home page (simple entry point).
 *
 * This project is an exam exercise: the home page is intentionally minimal,
 * and mostly acts as a quick check that React Router is correctly wired.
 */
export default function Home() {
  const { witcher } = useWitcher();

  return <HomeView witcher={witcher} />;
}
