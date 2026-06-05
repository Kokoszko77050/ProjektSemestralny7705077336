const express = require('express')
const cors = require('cors')
const { createClient } = require('@supabase/supabase-js')
const dotenv = require('dotenv')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000;

app.use(cors())
app.use(express.json())
app.use(express.static('projekt_sem_frontend'))

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

// filtrowanie książek po gatunku
app.get('/api/ksiazki', async (req, res) => {
  const { autor, wydawnictwo, rok, genre, opis, url } = req.query

  let query = supabase.from('Ksiazki').select('*')
  if (autor) query = query.eq('Autor', autor)
  if (wydawnictwo) query = query.eq('Wydawnictwo', wydawnictwo)
  if (rok) query = query.eq('RokWydania', rok)
  if (genre) query = query.eq('Genre', genre)
  if (opis) query = query.eq('Opis', opis)
  if (url) query = query.eq('ZdjecieURL', url)

  const { data, error } = await query

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// dodawanie książek do bazy danych
app.post('/api/ksiazki', async (req, res) => {
  const { Nazwa, Autor, Wydawnictwo, RokWydania, Genre, Opis, ZdjecieURL } = req.body

  if (!Nazwa || !Autor || !Wydawnictwo || !RokWydania || !Genre) {
    return res.status(400).json({ error: 'Wypełnij wymagane pola' })
  }

  const { data, error } = await supabase
    .from('Ksiazki')
    .insert([{
      Nazwa,
      Autor,
      Wydawnictwo,
      RokWydania,
      Genre,
      Opis: Opis || '',
      ZdjecieURL: ZdjecieURL || ''
    }])
    .select()

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.status(201).json({
    message: 'Książka dodana pomyślnie',
    book: data[0]
  })
})

// EDYCJA KSIĄŻKI

app.put('/api/ksiazki/:id', async (req, res) => {
  const { id } = req.params
  const { Nazwa, Autor, Wydawnictwo, RokWydania, Genre, Opis, ZdjecieURL } = req.body

  if (!Nazwa || !Autor || !Wydawnictwo || !RokWydania || !Genre) {
    return res.status(400).json({ error: 'Wypełnij wymagane pola' })
  }

  const { data, error } = await supabase
    .from('Ksiazki')
    .update({
      Nazwa,
      Autor,
      Wydawnictwo,
      RokWydania,
      Genre,
      Opis,
      ZdjecieURL
    })
    .eq('id', id)
    .select()

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.json({
    message: 'Książka została zaktualizowana',
    book: data[0]
  })
})

// pobieranie komentarzy dla książki
app.get('/api/ksiazki/:id/komentarze', async (req, res) => {
  const { id } = req.params

  const { data, error } = await supabase
    .from('Komentarze')
    .select('*')
    .eq('idKsiazki', id)
    .order('Data', { ascending: false })

  if (error) {
    return res.status(500).json({
      error: error.message
    })
  }

  res.json(data)
})

// dodawanie komentarza
app.post('/api/ksiazki/:id/komentarze', async (req, res) => {
  const { id } = req.params

  const {
    Tresc,
    Ocena,
    Autor
  } = req.body

  if (!Tresc || !Ocena) {
    return res.status(400).json({
      error: 'Komentarz i ocena są wymagane'
    })
  }

  const nowyKomentarz = {
    idKsiazki: Number(id),
    Komentarz: Tresc,
    Data: new Date().toISOString(),
    Opinia: Ocena,
    EmailKomentatora: Autor || 'Anonim'
  }

  const { data, error } = await supabase
    .from('Komentarze')
    .insert([nowyKomentarz])
    .select()

  if (error) {
    return res.status(500).json({
      error: error.message
    })
  }

  res.status(201).json({
    message: 'Komentarz dodany',
    komentarz: data[0]
  })
})

// usuwanie komentarza
app.delete('/api/ksiazki/:id/komentarze/:idKomentarza', async (req, res) => {
  const { id, idKomentarza } = req.params

  const { error } = await supabase
    .from('Komentarze')
    .delete()
    .eq('id', idKomentarza)
    .eq('idKsiazki', id)

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.json({
    message: 'Komentarz został usunięty'
  })
})

// usuwanie konta
app.delete('/delete-account', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]

  const { data: { user }, error } =
    await supabase.auth.getUser(token)

  if (error || !user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { error: deleteError } =
    await supabase.auth.admin.deleteUser(user.id)

  if (deleteError) {
    return res.status(400).json(deleteError)
  }

  res.json({ success: true })
})


app.listen(PORT, () => {
  console.log(`Serwer działa na porcie: http://localhost:${PORT}`)
})