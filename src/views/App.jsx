import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// Component Imports
import {
  ErrorHeroComponent,
  ExploreComponent,
  HomeHeroComponent,
  ProfileHeroComponent,
  SettingsHeroComponent,
  SignInHeroComponent,
} from "./HeroComponents";
import { NavbarComponent } from "./GeneralComponents";

function App() {
  return (
    <Router>
      <section className="App" id="App">
        <NavbarComponent />
        <Switch>
          <Route exact path="/" component={HomeHeroComponent} />
          <Route exact path="/chat" component={HomeHeroComponent} />
          <Route path="/explore" component={ExploreComponent} />
          <Route exact path="/joinCommunity" component={HomeHeroComponent} />
          <Route
            path="/joinCommunity/:communityID"
            component={HomeHeroComponent}
          />
          <Route exact path="/createCommunity" component={HomeHeroComponent} />
          <Route exact path="/editCommunity" component={HomeHeroComponent} />
          <Route exact path="/profile" component={ProfileHeroComponent} />
          <Route exact path="/settings" component={SettingsHeroComponent} />
          <Route exact path="/login" component={SignInHeroComponent} />
          <Route component={ErrorHeroComponent} />
        </Switch>
      </section>
    </Router>
  );
}
export default App;
