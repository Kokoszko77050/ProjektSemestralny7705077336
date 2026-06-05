const listaKsiazek = document.getElementById('booksList');
const formularzDodawaniaKsiazki = document.getElementById('addBookForm');

const filtrAutor = document.getElementById('filterAuthor');
const filtrWydawnictwo = document.getElementById('filterPublisher');
const filtrRok = document.getElementById('filterYear');
const filtrGatunek = document.getElementById('filterGenre');
const przyciskCzyszczeniaFiltrow = document.getElementById('clearFiltersBtn');
const sortowanieKsiazek = document.getElementById('sortBooks');

const widokGlowny = document.getElementById('mainView');
const widokSzczegolow = document.getElementById('detailsView');
const przyciskPowrotu = document.getElementById('backToListBtn');

const szczegolyZdjecie = document.getElementById('detailImage');
const szczegolyTytul = document.getElementById('detailTitle');
const szczegolyAutor = document.getElementById('detailAuthor');
const szczegolyWydawnictwo = document.getElementById('detailPublisher');
const szczegolyRok = document.getElementById('detailYear');
const szczegolyGatunek = document.getElementById('detailGenre');
const szczegolyOpis = document.getElementById('detailDescription');
const szczegolyBrakZdjecia = document.getElementById('detailNoCover');
const sredniaOcena = document.getElementById('averageRating');

const formularzKomentarza = document.getElementById('commentForm');
const poleKomentarza = document.getElementById('commentText');
const ocenaKomentarza = document.getElementById('commentRating');
const anonimowyKomentarz = document.getElementById('anonymousComment');
const listaKomentarzy = document.getElementById('commentsList');
const komunikatKomentarza = document.getElementById('commentMessage');
const sortowanieKomentarzy = document.getElementById('sortComments');
const widokKomentarzy = document.getElementById('commentsViewMode');

const loginPanel = document.getElementById('loginPanel');
const accountPanel = document.getElementById('accountPanel');
const userEmailInfo = document.getElementById('userEmailInfo');
const authForm = document.getElementById('authForm');
const registerBtn = document.getElementById('registerBtn');
const authMessage = document.getElementById('authMessage');
const addBookPanel = document.getElementById('addBookPanel');

const accountMessage = document.getElementById('accountMessage');
const changePasswordBtn = document.getElementById('changePasswordBtn');
const logoutBtn2 = document.getElementById('logoutBtn2');
const deleteAccountBtn = document.getElementById('deleteAccountBtn');

let wszystkieKsiazki = [];
let aktualnaKsiazka = null;
let aktualneKomentarze = [];
let aktualnyUzytkownik = null;

// Konfiguracja Supabase jest po stronie backendu.
const supabaseUrl = 'https://pwcsiarrpkhhcekhtrqz.supabase.co';
const supabaseKey = 'sb_publishable_QelW0bonBh-UFNlXysZVhQ_F4XYyxQb';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// Pomocnicza funkcja do obsługi różnych nazw pól, jeśli backend zwróci małe litery.
function pobierzPole(obiekt, nazwaPolska, nazwaMala, wartoscDomyslna = '') {
  return obiekt?.[nazwaPolska] ?? obiekt?.[nazwaMala] ?? wartoscDomyslna;
}

// Pomocnicza funkcja do pobrania ID książki.
function pobierzIdKsiazki(ksiazka) {
  return ksiazka?.id ?? ksiazka?.Id ?? ksiazka?.ID ?? ksiazka?.KsiazkaId ?? ksiazka?.ksiazkaId;
}

// Pomocnicza funkcja do pobrania autora komentarza.
function pobierzAutoraKomentarza(komentarz) {
  return komentarz.EmailKomentatora
    ?? komentarz.emailKomentatora
    ?? komentarz.Autor
    ?? komentarz.autor
    ?? 'Anonim';
}

// Pomocnicza funkcja do pobrania treści komentarza.
function pobierzTrescKomentarza(komentarz) {
  return komentarz.Komentarz
    ?? komentarz.komentarz
    ?? komentarz.Tresc
    ?? komentarz.tresc
    ?? '';
}

// Pomocnicza funkcja do pobrania oceny komentarza.
function pobierzOceneKomentarza(komentarz) {
  return Number(
    komentarz.Opinia
    ?? komentarz.opinia
    ?? komentarz.Ocena
    ?? komentarz.ocena
    ?? 0
  );
}

// Pobieranie książek z backendu.
async function pobierzKsiazki() {
  try {
    const odpowiedz = await fetch('/api/ksiazki');

    if (!odpowiedz.ok) {
      throw new Error('Backend zwrócił błąd podczas pobierania książek.');
    }

    wszystkieKsiazki = await odpowiedz.json();
    wyswietlKsiazki(wszystkieKsiazki);
  } catch (blad) {
    console.error('Błąd podczas pobierania książek:', blad);
    listaKsiazek.innerHTML = '<p class="empty-message">Nie udało się pobrać książek.</p>';
  }
}

// Wyświetlanie listy książek.
function wyswietlKsiazki(ksiazki) {
  listaKsiazek.innerHTML = '';

  if (!Array.isArray(ksiazki) || ksiazki.length === 0) {
    listaKsiazek.innerHTML = '<p class="empty-message">Brak książek do wyświetlenia.</p>';
    return;
  }

  const ksiazkiDoWyswietlenia = posortujKsiazki([...ksiazki]);

  ksiazkiDoWyswietlenia.forEach(ksiazka => {
    const nazwa = pobierzPole(ksiazka, 'Nazwa', 'nazwa', 'Brak tytułu');
    const autor = pobierzPole(ksiazka, 'Autor', 'autor', 'Brak autora');
    const rok = pobierzPole(ksiazka, 'RokWydania', 'rokWydania', 'Brak roku');
    const gatunek = pobierzPole(ksiazka, 'Genre', 'genre', 'Brak gatunku');
    const zdjecie = pobierzPole(ksiazka, 'ZdjecieURL', 'zdjecieURL', '');

    const kartaKsiazki = document.createElement('article');
    kartaKsiazki.classList.add('book-card');

    kartaKsiazki.innerHTML = `
      <div class="card-cover ${zdjecie ? '' : 'no-cover'}">
        ${zdjecie ? `<img src="${zdjecie}" alt="Okładka książki ${nazwa}">` : '<span>Brak okładki</span>'}
      </div>

      <div class="card-content">
        <h3>${nazwa}</h3>
        <p><strong>Autor:</strong> ${autor}</p>
        <p><strong>Rok:</strong> ${rok}</p>
        <p><strong>Gatunek:</strong> ${gatunek}</p>
        <button class="details-btn">Szczegóły</button>
      </div>
    `;

    const przyciskSzczegolow = kartaKsiazki.querySelector('.details-btn');
    przyciskSzczegolow.addEventListener('click', () => pokazSzczegolyKsiazki(ksiazka));

    listaKsiazek.appendChild(kartaKsiazki);
  });
}

// Dodawanie książki do backendu.
formularzDodawaniaKsiazki.addEventListener('submit', async (zdarzenie) => {
  zdarzenie.preventDefault();

  const daneFormularza = new FormData(formularzDodawaniaKsiazki);
  const daneKsiazki = Object.fromEntries(daneFormularza.entries());

  try {
    const odpowiedz = await fetch('/api/ksiazki', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(daneKsiazki)
    });

    const wynik = await odpowiedz.json();

    if (odpowiedz.ok) {
      formularzDodawaniaKsiazki.reset();
      await pobierzKsiazki();
      alert(wynik.message || 'Książka została dodana.');
    } else {
      alert('Błąd: ' + (wynik.error || 'Nie udało się dodać książki.'));
    }
  } catch (blad) {
    console.error('Błąd podczas dodawania książki:', blad);
    alert('Nie udało się dodać książki.');
  }
});

// Sortowanie książek na podstawie wyboru użytkownika.
function posortujKsiazki(ksiazki) {
  const sposobSortowania = sortowanieKsiazek.value;

  if (sposobSortowania === 'titleAsc') {
    return ksiazki.sort((a, b) =>
      String(pobierzPole(a, 'Nazwa', 'nazwa')).localeCompare(String(pobierzPole(b, 'Nazwa', 'nazwa')))
    );
  }

  if (sposobSortowania === 'titleDesc') {
    return ksiazki.sort((a, b) =>
      String(pobierzPole(b, 'Nazwa', 'nazwa')).localeCompare(String(pobierzPole(a, 'Nazwa', 'nazwa')))
    );
  }

  if (sposobSortowania === 'yearAsc') {
    return ksiazki.sort((a, b) => Number(pobierzPole(a, 'RokWydania', 'rokWydania', 0)) - Number(pobierzPole(b, 'RokWydania', 'rokWydania', 0)));
  }

  if (sposobSortowania === 'yearDesc') {
    return ksiazki.sort((a, b) => Number(pobierzPole(b, 'RokWydania', 'rokWydania', 0)) - Number(pobierzPole(a, 'RokWydania', 'rokWydania', 0)));
  }

  return ksiazki;
}

// Filtrowanie książek po danych widocznych na stronie.
function filtrujKsiazki() {
  const wartoscAutora = filtrAutor.value.toLowerCase();
  const wartoscWydawnictwa = filtrWydawnictwo.value.toLowerCase();
  const wartoscRoku = filtrRok.value;
  const wartoscGatunku = filtrGatunek.value.toLowerCase();

  const przefiltrowaneKsiazki = wszystkieKsiazki.filter(ksiazka => {
    const autorKsiazki = String(pobierzPole(ksiazka, 'Autor', 'autor')).toLowerCase();
    const wydawnictwoKsiazki = String(pobierzPole(ksiazka, 'Wydawnictwo', 'wydawnictwo')).toLowerCase();
    const rokKsiazki = String(pobierzPole(ksiazka, 'RokWydania', 'rokWydania'));
    const gatunekKsiazki = String(pobierzPole(ksiazka, 'Genre', 'genre')).toLowerCase();

    return (
      autorKsiazki.includes(wartoscAutora) &&
      wydawnictwoKsiazki.includes(wartoscWydawnictwa) &&
      rokKsiazki.includes(wartoscRoku) &&
      gatunekKsiazki.includes(wartoscGatunku)
    );
  });

  wyswietlKsiazki(przefiltrowaneKsiazki);
}

filtrAutor.addEventListener('input', filtrujKsiazki);
filtrWydawnictwo.addEventListener('input', filtrujKsiazki);
filtrRok.addEventListener('input', filtrujKsiazki);
filtrGatunek.addEventListener('input', filtrujKsiazki);
sortowanieKsiazek.addEventListener('change', filtrujKsiazki);

przyciskCzyszczeniaFiltrow.addEventListener('click', () => {
  filtrAutor.value = '';
  filtrWydawnictwo.value = '';
  filtrRok.value = '';
  filtrGatunek.value = '';
  sortowanieKsiazek.value = 'default';

  wyswietlKsiazki(wszystkieKsiazki);
});

// Pokazywanie pełnego widoku szczegółów książki.
function pokazSzczegolyKsiazki(ksiazka) {
  aktualnaKsiazka = ksiazka;

  const nazwa = pobierzPole(ksiazka, 'Nazwa', 'nazwa', 'Brak tytułu');
  const autor = pobierzPole(ksiazka, 'Autor', 'autor', 'Brak autora');
  const wydawnictwo = pobierzPole(ksiazka, 'Wydawnictwo', 'wydawnictwo', 'Brak wydawnictwa');
  const rok = pobierzPole(ksiazka, 'RokWydania', 'rokWydania', 'Brak roku');
  const gatunek = pobierzPole(ksiazka, 'Genre', 'genre', 'Brak gatunku');
  const opis = pobierzPole(ksiazka, 'Opis', 'opis', 'Brak opisu.');
  const zdjecie = pobierzPole(ksiazka, 'ZdjecieURL', 'zdjecieURL', '');

  szczegolyTytul.textContent = nazwa;
  szczegolyAutor.textContent = autor;
  szczegolyWydawnictwo.textContent = wydawnictwo;
  szczegolyRok.textContent = rok;
  szczegolyGatunek.textContent = gatunek;
  szczegolyOpis.textContent = opis;

  if (zdjecie) {
    szczegolyZdjecie.src = zdjecie;
    szczegolyZdjecie.alt = `Okładka książki ${nazwa}`;
    szczegolyZdjecie.style.display = 'block';
    szczegolyBrakZdjecia.style.display = 'none';
  } else {
    szczegolyZdjecie.removeAttribute('src');
    szczegolyZdjecie.alt = '';
    szczegolyZdjecie.style.display = 'none';
    szczegolyBrakZdjecia.style.display = 'block';
  }

  widokGlowny.classList.add('hidden');
  widokSzczegolow.classList.remove('hidden');

  pobierzKomentarze();
}

// Powrót z widoku szczegółów do listy książek.
przyciskPowrotu.addEventListener('click', () => {
  widokSzczegolow.classList.add('hidden');
  widokGlowny.classList.remove('hidden');
  aktualnaKsiazka = null;
  aktualneKomentarze = [];
});

// Pobieranie komentarzy z backendu.
async function pobierzKomentarze() {
  const idKsiazki = pobierzIdKsiazki(aktualnaKsiazka);

  if (!idKsiazki) {
    listaKomentarzy.innerHTML = '<p class="empty-message">Brak ID książki, więc nie można pobrać komentarzy.</p>';
    sredniaOcena.textContent = 'Brak ocen';
    return;
  }

  try {
    const odpowiedz = await fetch(`/api/ksiazki/${idKsiazki}/komentarze`);

    if (!odpowiedz.ok) {
      throw new Error('Backend nie zwrócił komentarzy.');
    }

    aktualneKomentarze = await odpowiedz.json();
    wyswietlKomentarze();
  } catch (blad) {
    console.error('Błąd podczas pobierania komentarzy:', blad);
    aktualneKomentarze = [];
    sredniaOcena.textContent = 'Brak ocen';
    listaKomentarzy.innerHTML = '<p class="empty-message">Komentarze będą widoczne po podłączeniu endpointu w backendzie.</p>';
  }
}

// Sortowanie komentarzy po wybranym sposobie.
function posortujKomentarze(komentarze) {
  const sposobSortowania = sortowanieKomentarzy.value;

  if (sposobSortowania === 'ratingDesc') {
    return komentarze.sort((a, b) => pobierzOceneKomentarza(b) - pobierzOceneKomentarza(a));
  }

  if (sposobSortowania === 'ratingAsc') {
    return komentarze.sort((a, b) => pobierzOceneKomentarza(a) - pobierzOceneKomentarza(b));
  }

  if (sposobSortowania === 'authorAsc') {
    return komentarze.sort((a, b) => pobierzAutoraKomentarza(a).localeCompare(pobierzAutoraKomentarza(b)));
  }

  return komentarze;
}

// Aktualizacja średniej oceny książki.
function aktualizujSredniaOcene(komentarze) {
  const oceny = komentarze
    .map(komentarz => pobierzOceneKomentarza(komentarz))
    .filter(ocena => ocena > 0);

  if (oceny.length === 0) {
    sredniaOcena.textContent = 'Brak ocen';
    return;
  }

  const sumaOcen = oceny.reduce((suma, ocena) => suma + ocena, 0);
  const srednia = sumaOcen / oceny.length;

  sredniaOcena.textContent = `${srednia.toFixed(1)} / 5 (${oceny.length} opinii)`;
}

// Wyświetlanie komentarzy i opinii.
function wyswietlKomentarze() {
  listaKomentarzy.innerHTML = '';
  listaKomentarzy.classList.toggle('compact-comments', widokKomentarzy.value === 'compact');
  if (!Array.isArray(aktualneKomentarze) || aktualneKomentarze.length === 0) {
    sredniaOcena.textContent = 'Brak ocen';
    listaKomentarzy.innerHTML = '<p class="empty-message">Brak komentarzy dla tej książki.</p>';
    return;
  }

  aktualizujSredniaOcene(aktualneKomentarze);

  const komentarzeDoWyswietlenia = posortujKomentarze([...aktualneKomentarze]);

  komentarzeDoWyswietlenia.forEach(komentarz => {
    const tekstKomentarza = pobierzTrescKomentarza(komentarz);
    const autorKomentarza = pobierzAutoraKomentarza(komentarz);
    const ocena = pobierzOceneKomentarza(komentarz);

    const data = komentarz.Data
  ? new Date(komentarz.Data).toLocaleDateString('pl-PL')
  : '';
  
    const elementKomentarza = document.createElement('div');
    elementKomentarza.classList.add('comment');

    elementKomentarza.innerHTML = `
      <div class="comment-top">
        <strong>${autorKomentarza || 'Anonim'}</strong>
         <span>${data}</span>
        <span class="rating-badge">${ocena ? `Ocena ${ocena}/5` : 'Bez oceny'}</span>
      </div>
      <p>${tekstKomentarza}</p>
    `;

    listaKomentarzy.appendChild(elementKomentarza);
  });
}

sortowanieKomentarzy.addEventListener('change', wyswietlKomentarze);
widokKomentarzy.addEventListener('change', wyswietlKomentarze);

// Dodawanie komentarza lub opinii.
formularzKomentarza.addEventListener('submit', async (zdarzenie) => {
  zdarzenie.preventDefault();

  const idKsiazki = pobierzIdKsiazki(aktualnaKsiazka);
  const tresc = poleKomentarza.value.trim();
  const ocena = Number(ocenaKomentarza.value);
  const czyAnonimowo = anonimowyKomentarz.checked;
  const autor = czyAnonimowo || !aktualnyUzytkownik ? 'Anonim' : aktualnyUzytkownik.email;

  if (!idKsiazki) {
    komunikatKomentarza.textContent = 'Nie można dodać komentarza, bo książka nie ma ID.';
    return;
  }

  if (!tresc) {
    komunikatKomentarza.textContent = 'Wpisz treść komentarza.';
    return;
  }

  const daneKomentarza = {
    Tresc: tresc,
    Opinia: tresc,
    Ocena: ocena,
    Autor: autor,
    Anonimowy: czyAnonimowo || !aktualnyUzytkownik
  };

  try {
    const odpowiedz = await fetch(`/api/ksiazki/${idKsiazki}/komentarze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(daneKomentarza)
    });

    const wynik = await odpowiedz.json();

    if (odpowiedz.ok) {
      poleKomentarza.value = '';
      anonimowyKomentarz.checked = false;
      ocenaKomentarza.value = '5';
      komunikatKomentarza.textContent = wynik.message || 'Opinia została dodana.';
      await pobierzKomentarze();
    } else {
      komunikatKomentarza.textContent = wynik.error || 'Nie udało się dodać opinii.';
    }
  } catch (blad) {
    console.error('Błąd podczas dodawania komentarza:', blad);
    komunikatKomentarza.textContent = 'Dodawanie opinii będzie działać po podłączeniu endpointu w backendzie.';
  }
});

// Rejestracja użytkownika przez Supabase.
registerBtn.addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const { error } = await supabaseClient.auth.signUp({
    email,
    password
  });

  if (error) {
    authMessage.textContent = error.message;
  } else {
    authMessage.textContent = 'Konto utworzone. Sprawdź email, jeśli Supabase wymaga potwierdzenia.';
  }
});

// Logowanie użytkownika przez Supabase.
authForm.addEventListener('submit', async (zdarzenie) => {
  zdarzenie.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    authMessage.textContent = error.message;
  } else {
    authMessage.textContent = 'Zalogowano';
    setTimeout(() => {
      sprawdzAdmina();
      aktualizujPanelKonta();
    }, 300);
  }
});

// Sprawdzanie, czy użytkownik ma rolę administratora.
async function sprawdzAdmina() {
  const { data: { user } } = await supabaseClient.auth.getUser();

  aktualnyUzytkownik = user;

  if (!user) {
    addBookPanel.style.display = 'none';
    return;
  }

  const { data: profil, error } = await supabaseClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Błąd podczas pobierania profilu:', error);
  }

  if (profil?.role === 'admin') {
    addBookPanel.style.display = 'block';
  } else {
    addBookPanel.style.display = 'none';
  }
}

// Aktualizacja panelu konta po zalogowaniu lub wylogowaniu.
async function aktualizujPanelKonta() {
  const { data: { user } } = await supabaseClient.auth.getUser();

  aktualnyUzytkownik = user;

  if (user) {
    loginPanel.classList.add('hidden');
    accountPanel.classList.remove('hidden');
    userEmailInfo.textContent = `Zalogowano jako: ${user.email}`;
  } else {
    loginPanel.classList.remove('hidden');
    accountPanel.classList.add('hidden');
    userEmailInfo.textContent = 'Zarządzanie kontem użytkownika.';
  }
}

// Zmiana hasła użytkownika.
changePasswordBtn.addEventListener('click', async () => {
  const noweHaslo = document.getElementById('newPassword').value;

  if (!noweHaslo) {
    accountMessage.textContent = 'Wpisz nowe hasło.';
    return;
  }

  const { error } = await supabaseClient.auth.updateUser({
    password: noweHaslo
  });

  if (error) {
    accountMessage.textContent = error.message;
  } else {
    accountMessage.textContent = 'Hasło zmienione.';
  }
});

// Wylogowanie z panelu konta.
logoutBtn2.addEventListener('click', async () => {
  await supabaseClient.auth.signOut();

  accountMessage.textContent = 'Wylogowano.';
  addBookPanel.style.display = 'none';
  sprawdzAdmina();
  aktualizujPanelKonta();
});

// Usuwanie konta przez endpoint backendu.
deleteAccountBtn.addEventListener('click', async () => {
  const potwierdzenie = confirm('Na pewno usunąć konto?');

  if (!potwierdzenie) {
    return;
  }

  const session = await supabaseClient.auth.getSession();
  const token = session?.data?.session?.access_token;

  if (!token) {
    accountMessage.textContent = 'Brak aktywnej sesji.';
    return;
  }

  const odpowiedz = await fetch('/delete-account', {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const wynik = await odpowiedz.json();

  if (wynik.success) {
    alert('Konto usunięte.');
    await supabaseClient.auth.signOut();
    addBookPanel.style.display = 'none';
    aktualizujPanelKonta();
  } else {
    accountMessage.textContent = wynik.error || 'Nie udało się usunąć konta.';
  }
});

// Start aplikacji.
pobierzKsiazki();
sprawdzAdmina();
aktualizujPanelKonta();

supabaseClient.auth.onAuthStateChange(() => {
  sprawdzAdmina();
  aktualizujPanelKonta();
});
