import { useEffect, useState } from 'react';
import logo from '../../img/header-logo.svg';
import headerImg from '../../img/HEADER_IMG.svg';
import headerImgLogged from '../../img/HEADER-community.svg';
import { useUserIDContext } from '../../UserIDContext';
import { getUser } from '../../backend/boardapi';

interface HomeRouteName {
  homeRoute: 'home' | 'page' | undefined;
  headline: string | undefined;
}

export const Header: React.FC<HomeRouteName> = ({ homeRoute, headline }) => {
  const { userID } = useUserIDContext();
  const [hR, setHomeRoute] = useState<'home' | 'page' | undefined>(homeRoute);
  const [hl, setHeadline] = useState<string | undefined>(headline);
  const [firstname, setFirstname] = useState<string>('');

  const fetchUserProfile = async () => {
    try {
      const userName = await getUser(userID || "");
      setFirstname(userName.name.first);
      //console.log('HEADER: ', userName.name.first);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    setHomeRoute(homeRoute);
    setHeadline(headline);
    if (userID) {
      fetchUserProfile();
    }
  }, [userID, headline]); // useEffect will trigger when userID changes

  return (
    <header>
      <div className="max-grid">
        {hR === 'home' ? (
          //Code für 'home'
          <>
            {userID == undefined ?
              // MAIN PAGE WTHOUT LOGIN
              <>
                <div className="header-general">
                  <div className='grid grid-cols-1 lg:gap-5 lg:grid-cols-12'>
                    <div className="lg:col-span-8 clouds">
                      <img src={logo} className="header-logo" alt="Logo" />
                      <h1 className="font-francisco">Mach die Stadt zu deinem Abendteuer
                        <span className="font-sans">
                          Willkommen bei Click & Connect! Tauche ein in unsere Eventplattform und entdecke spannende Abenteuer in deiner Stadt. Erlebe die Vielfalt deiner Stadt auf völlig neue Weisen und knüpfe wertvolle Verbindungen. Sei Teil unserer Community und gestalte deine Freizeit auf einzigartige Art und Weise.
                        </span>
                        <form onSubmit={() => { }}>
                          <label>
                            <input id="event" type="text" placeholder="Event suchen" />
                          </label>
                          <label>
                            <input id="place" type="text" placeholder="Ort oder PLZ" />
                          </label>
                          <label>
                            <input type="submit" />
                          </label>
                        </form>
                      </h1>
                    </div>
                    <div className="col-span-1 header-img-box lg:col-span-4">
                      <img src={headerImg} className="header-img" alt="Pärchen erkundet eine Stadt" />
                    </div>
                  </div>
                </div>
              </> : <>{/* MAINPAGE WITH LOGGED IN USER */}
                <div className="header-logged-in">
                  <div className='grid md:gap-5 md:grid-cols-12'>
                    <div className="grid col-span-1 md:col-span-5">
                      <img src={headerImgLogged} className="cummunityImg" alt="Meet some people"></img>
                    </div>
                    <div className="col-span-1 md:col-span-7">
                      <h1>Hi {firstname!}</h1>
                      {/* <p>Willkommen! Du hast 3 neue Nachrichten und eine Bewertung!</p> */}
                      <p>Willkommen zurück! Wir freuen uns, dich wieder bei uns begrüßen zu dürfen. Dein Account ist jetzt aktiv, und wir stehen bereit, dir ein erstklassiges Erlebnis zu bieten.</p>
                    </div>
                  </div>
                </div>
              </>}
          </>
        ) : hR === 'page' ? (
          //Code für 'page'
          <>
            <div className="header-page">
              <div>
                <h1>{hl}</h1>
              </div>
            </div>
          </>
        ) : (
          // JSX-Code für andere Fälle (falls erforderlich)
          <>
            {/* Dein Code für andere Fälle hier */}
          </>
        )}

      </div>
    </header>
  );
};
