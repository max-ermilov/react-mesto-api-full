import React from "react";
import {Link, Switch, Route} from "react-router-dom";

function Header({onSingOut, userEmail}) {
  return (
    <header className="header page__header">
      <a href="./" className="header__logo"/>
      <nav className="header__navigation">
        <Switch>
          <Route exact path="/">
            <p className="header__email">{userEmail}</p>
            <Link
              className="button header__navigation-button header__navigation-button_shadowed"
              onClick={onSingOut}
              to="/sign-in"
            >
              Выход
            </Link>
          </Route>
          <Route path="/sign-up">
            <Link className="button header__navigation-button" to="/sign-in">
              Войти
            </Link>
          </Route>
          <Route path="/sign-in">
            <Link className="button header__navigation-button" to="/sign-up">
              Регистрация
            </Link>
          </Route>
        </Switch>
      </nav>
    </header>
  )
}

export default Header
