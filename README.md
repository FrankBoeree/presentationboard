# Presentation Board

Een minimalistisch presentatiebord voor live feedback en interactie, geïnspireerd door het design van Dieter Rams.

## 🎯 Doel

Deze webapp stelt presentatoren in staat om realtime feedback te verzamelen van hun publiek. Kijkers kunnen notes plaatsen, stemmen op populaire ideeën, en de presentator heeft volledige controle over de sessie.

## ✨ Features

- **Realtime Updates**: Notes en stemmen verschijnen direct zonder refresh
- **QR Code Sharing**: Eenvoudig delen via QR code of 6-cijferige code
- **Note Types**: Vraag, Idee, Actie, Opmerking met visuele badges
- **Voting System**: Upvote systeem met unieke stem per device
- **Presenter Tools**: Lock board, verwijder notes, export naar CSV
- **Responsive Design**: Werkt perfect op desktop en mobile
- **Accessibility**: Volledig toegankelijk met keyboard navigation en ARIA labels

## 🛠 Tech Stack

- **Frontend**: Next.js 14 met App Router, TypeScript
- **Styling**: Tailwind CSS met Dieter Rams design systeem
- **Database**: Supabase Postgres met Realtime
- **Icons**: Lucide React
- **QR Codes**: qrcode.react
- **Testing**: Jest met React Testing Library

## 🚀 Quick Start

### 1. Clone en installeer dependencies

```bash
git clone <repository-url>
cd presentation-board
npm install
```

### 2. Supabase Setup

1. Maak een nieuw Supabase project aan
2. Kopieer `env.example` naar `.env.local`
3. Vul je Supabase URL en anon key in
4. Voer het database schema uit:

```bash
# In je Supabase SQL editor
cat supabase.sql
```

### 3. Start development server

```bash
npm run dev
```

### 4. Seed demo data (optioneel)

```bash
npm run seed
```

Bezoek `http://localhost:3000` om te beginnen!

## 📱 Gebruik

### Voor Presentatoren

1. Ga naar de startpagina
2. Klik "Maak nieuw board"
3. Voer een titel in voor je presentatie
4. Deel de code of QR met je publiek
5. Gebruik de presenter tools om de sessie te beheren

### Voor Kijkers

1. Ga naar `/join` of scan de QR code
2. Voer de 6-cijferige code in
3. Plaats notes en stem op populaire ideeën
4. Filter en sorteer notes naar wens

## 🎨 Design Systeem

Het design is geïnspireerd door Dieter Rams' principes:

- **Kleuren**: Wit, lichtgrijs, subtiele borders
- **Typografie**: Inter font met duidelijke hiërarchie
- **Componenten**: Maximaal 4px border radius, minimale schaduwen
- **Animatie**: Subtiel en kort, respecteert reduced motion
- **Accessibility**: Focus states, keyboard navigation, ARIA labels

## 🗄 Database Schema

### Boards
- `id`: UUID primary key
- `code`: 6-cijferige unieke code
- `title`: Presentatie titel
- `locked`: Boolean voor vergrendeling

### Notes
- `id`: UUID primary key
- `board_id`: Foreign key naar boards
- `text`: Note inhoud (max 240 tekens)
- `type`: Vraag, Idee, Actie, Opmerking
- `author`: Optionele auteur naam
- `votes`: Stem teller
- `created_at`: Timestamp

### Votes
- `id`: UUID primary key
- `note_id`: Foreign key naar notes
- `device_id`: Unieke device identifier
- `created_at`: Timestamp

## 🔒 Beveiliging

- **Row Level Security**: Alle tabellen hebben RLS policies
- **Rate Limiting**: Maximaal 1 note per 10 seconden per device
- **Input Validation**: Server-side validatie van alle inputs
- **Profanity Filter**: Basis client-side filtering
- **Unique Voting**: Een stem per note per device

## 🧪 Testing

```bash
# Run alle tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests met coverage
npm test -- --coverage
```

## 📦 Build & Deploy

```bash
# Build voor productie
npm run build

# Start productie server
npm start
```

## 🛣 Routes

- `/` - Startpagina (maak board of join)
- `/join` - Join pagina met code invoer
- `/b/[code]` - Kijker view van board
- `/presenter/[code]` - Presenter view met tools

## 🔧 Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build voor productie
- `npm run start` - Start productie server
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run seed` - Seed demo data

## 🤝 Contributing

1. Fork het project
2. Maak een feature branch
3. Commit je changes
4. Push naar de branch
5. Open een Pull Request

## 📄 License

MIT License - zie LICENSE bestand voor details.

## 🙏 Credits

- Design geïnspireerd door Dieter Rams
- Icons van Lucide React
- QR codes via qrcode.react
- Realtime functionaliteit via Supabase
