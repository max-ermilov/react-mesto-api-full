import React, {useState, useEffect, useCallback} from "react";
import {Route, Switch, Redirect, useHistory} from 'react-router-dom';
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import Login from "./Login";
import Register from "./Register"
import InfoTooltip from "./InfoTooltip";
import DeleteCardPopup from "./DeleteCardPopup";
import ImagePopup from "./ImagePopup";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ProtectedRoute from "./ProtectedRoute";
import * as auth from '../utils/auth.js';
import {api} from "../utils/api";
import {CurrentUserContext} from "../contexts/CurrentUserContext";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [signedUp, setSignedUp] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const history = useHistory();
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isDeleteCardPopupOpen, setIsDeleteCardPopupOpen] = useState(null);
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setPageIsLoading] = useState(true);

  useEffect(() => {
    tokenCheck();
  }, []);

  useEffect(() => {
    if (loggedIn) {
      history.push("/");
      return;
    }
    history.push('/sign-in');
  }, [loggedIn]);


  useEffect(() => {
    if (loggedIn) {
      Promise.all([api.getProfile(), api.getInitialCards()])
        .then(([profileData, initialCards]) => {
          setCurrentUser(profileData);
          setCards(initialCards.reverse());
          setPageIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPageIsLoading(false);
        })
    }
  }, [loggedIn])

  const handleLogin = (userInput) => {
    return auth.authorize(userInput)
      .then((res) => {
        localStorage.setItem('jwt', res.token);
        setLoggedIn(true);
        tokenCheck();
        history.push("/")
      })
      .catch(() => {
        setIsInfoTooltipPopupOpen(true);
        setSignedUp(false);
      });
  }

  // handleRegister with autologin after successful registration
  const handleRegister = (userInput) => {
    return auth.register(userInput)
      .then(() => {
        // Set timeout to prevent HTTP error 429
        setTimeout(() => {
          handleLogin(userInput)
        }, 300)
      })
      .then(() => {
        setSignedUp(true);
        setIsInfoTooltipPopupOpen(true);
      })
      .catch(() => {
        setSignedUp(false);
        setIsInfoTooltipPopupOpen(true);
      })
  }

  // simple handleRegister
  /*const handleRegister = (userInput) => {
    return auth.register(userInput)
      .then(() => {
        setSignedUp(true);
        setIsInfoTooltipPopupOpen(true);
        history.push("/sign-in");
      })
      .catch(() => {
        setSignedUp(false)
        setIsInfoTooltipPopupOpen(true);
      })
  }*/

  const tokenCheck = () => {
    if (localStorage.getItem('jwt')) {
      let jwt = localStorage.getItem('jwt');
      return auth
        .getUserCredentials(jwt)
        .then((res) => {
          if (res) {
            setUserEmail(res.email);
            setLoggedIn(true);
          }
        })
        .catch((err) => console.log(err))
    }
  }

  const handleSignOut = () => {
    localStorage.removeItem('jwt');
    setUserEmail('');
    setLoggedIn(false);
  }

  const handleCardLike = card => {
    const isLiked = card.likes.some(i => {
      return (i === currentUser._id)
    });
    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        const cardsAfterLike = cards.map((c) => c._id === card._id ? newCard : c);
        setCards(cardsAfterLike);
      })
      .catch(err => console.log(err));
  };

  const handleCardDelete = card => {
    setIsLoading(true);
    api.deleteCard(card._id)
      .then(() => {
        const cardsAfterDelete = cards.filter(item => item._id !== card._id);
        setCards(cardsAfterDelete);
        setIsLoading(false);
        closeAllPopups();
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      })
  };

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true)
  };

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true)
  };

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true)
  }

  const handleOnCardClick = (card) => {
    setSelectedCard(card)
  }

  const handleDeleteCardClick = (card) => {
    // write selected card into isDeleteCardPopupOpen to use in both open popup and deletion target
    setIsDeleteCardPopupOpen(card)
  }

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false)
    setIsAddPlacePopupOpen(false)
    setIsEditAvatarPopupOpen(false)
    setIsDeleteCardPopupOpen(null)
    setSelectedCard({})
    setIsInfoTooltipPopupOpen(false)
    setSignedUp(false)
  }

  const handleUpdateUser = (userInfo) => {
    setIsLoading(true);
    api.editProfile(userInfo)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      })
  }

  const handleUpdateAvatar = (avatar) => {
    //default avatar ==> https://live.staticflickr.com/3931/15229354939_7c28a19c66_q.jpg
    setIsLoading(true);
    api.editAvatar(avatar)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      })
  }
  const handleAddPlaceSubmit = (card) => {
    setIsLoading(true);
    api.addCard(card)
      .then(newCard => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      })
  }

  const keydownHandler = useCallback((e) => {
    if (e.key === 'Escape') {
      closeAllPopups();
    }
  }, [])

  useEffect(() => {
    if (isEditProfilePopupOpen || isAddPlacePopupOpen || isEditAvatarPopupOpen || isDeleteCardPopupOpen || isInfoTooltipPopupOpen || selectedCard.name) {
      document.addEventListener('keydown', keydownHandler);
      return () => document.removeEventListener('keydown', keydownHandler);
    }
  }, [isEditProfilePopupOpen, isAddPlacePopupOpen, isEditAvatarPopupOpen, isDeleteCardPopupOpen, isInfoTooltipPopupOpen, selectedCard]);

  return (

    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header
          userEmail={userEmail || ''}
          onSingOut={handleSignOut}
        />
        <Switch>
          <Route path="/sign-in">
            <Login
              onLogin={handleLogin}
            />
          </Route>

          <Route path="/sign-up">
            <Register
              onRegister={handleRegister}
            />
          </Route>

          <ProtectedRoute path="/" loggedIn={loggedIn}>
            <Main onEditProfile={handleEditProfileClick}
                  onAddPlace={handleAddPlaceClick}
                  onEditAvatar={handleEditAvatarClick}
                  onCardClick={handleOnCardClick}
                  cards={cards}
                  onCardLike={handleCardLike}
                  onCardDelete={handleDeleteCardClick}
                  isPageLoading={isPageLoading}
            />

            <EditProfilePopup isOpen={isEditProfilePopupOpen}
                              isLoading={isLoading}
                              onClose={closeAllPopups}
                              onUpdateUser={handleUpdateUser}
            />

            <EditAvatarPopup isOpen={isEditAvatarPopupOpen}
                             isLoading={isLoading}
                             onClose={closeAllPopups}
                             onUpdateAvatar={handleUpdateAvatar}
            />

            <AddPlacePopup isOpen={isAddPlacePopupOpen}
                           isLoading={isLoading}
                           onClose={closeAllPopups}
                           onAddPlace={handleAddPlaceSubmit}
            />

            <DeleteCardPopup isOpen={isDeleteCardPopupOpen}
                             isLoading={isLoading}
                             onClose={closeAllPopups}
                             card={isDeleteCardPopupOpen}
                             onCardDelete={handleCardDelete}
            />

            <ImagePopup card={selectedCard}
                        onClose={closeAllPopups}
            />

          </ProtectedRoute>

          <Route>
            {loggedIn ? <Redirect to="/"/> : <Redirect to="/sign-in"/>}
          </Route>
        </Switch>
        <InfoTooltip
          isOpen={isInfoTooltipPopupOpen}
          onClose={closeAllPopups}
          isSignedUp={signedUp}/>
        <InfoTooltip/>
        <Footer/>
      </div>
    </CurrentUserContext.Provider>

  );
}

export default App;
