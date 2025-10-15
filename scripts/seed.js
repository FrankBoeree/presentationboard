const { createClient } = require('@supabase/supabase-js')

// Demo board data
const DEMO_BOARD = {
  code: 'DEMO12',
  title: 'Demo Presentatie - Product Launch Q&A'
}

const DEMO_NOTES = [
  {
    text: 'Wanneer wordt de nieuwe versie gelanceerd?',
    type: 'Vraag',
    author: 'Sarah',
    votes: 8
  },
  {
    text: 'Kunnen we een dark mode toevoegen?',
    type: 'Idee',
    author: 'Mike',
    votes: 12
  },
  {
    text: 'Test de nieuwe API endpoints grondig',
    type: 'Actie',
    author: 'Dev Team',
    votes: 5
  },
  {
    text: 'De presentatie was erg duidelijk, bedankt!',
    type: 'Opmerking',
    author: 'Lisa',
    votes: 3
  },
  {
    text: 'Hoe zit het met de prijsstructuur?',
    type: 'Vraag',
    author: 'Tom',
    votes: 6
  },
  {
    text: 'Misschien kunnen we een mobile app maken?',
    type: 'Idee',
    author: 'Anna',
    votes: 9
  },
  {
    text: 'Documentatie bijwerken voor nieuwe features',
    type: 'Actie',
    author: 'Tech Writer',
    votes: 4
  },
  {
    text: 'Interessante demo, ik ben benieuwd naar meer details',
    type: 'Opmerking',
    author: 'David',
    votes: 2
  }
]

async function seedDemoBoard() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables')
    console.error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  try {
    console.log('🌱 Seeding demo board...')

    // Check if demo board already exists
    const { data: existingBoard } = await supabase
      .from('boards')
      .select('id')
      .eq('code', DEMO_BOARD.code)
      .single()

    if (existingBoard) {
      console.log('✅ Demo board already exists')
      
      // Check if it has notes
      const { data: existingNotes } = await supabase
        .from('notes')
        .select('id')
        .eq('board_id', existingBoard.id)

      if (existingNotes && existingNotes.length > 0) {
        console.log('✅ Demo board already has notes')
        return
      }
    }

    let boardId

    if (existingBoard) {
      boardId = existingBoard.id
      console.log('📝 Using existing demo board')
    } else {
      // Create demo board
      const { data: board, error: boardError } = await supabase
        .from('boards')
        .insert(DEMO_BOARD)
        .select()
        .single()

      if (boardError) {
        console.error('❌ Error creating demo board:', boardError)
        return
      }

      boardId = board.id
      console.log('✅ Created demo board:', DEMO_BOARD.code)
    }

    // Create demo notes
    const notesWithBoardId = DEMO_NOTES.map(note => ({
      ...note,
      board_id: boardId
    }))

    const { data: notes, error: notesError } = await supabase
      .from('notes')
      .insert(notesWithBoardId)
      .select()

    if (notesError) {
      console.error('❌ Error creating demo notes:', notesError)
      return
    }

    console.log(`✅ Created ${notes.length} demo notes`)

    // Create some demo votes
    const votes = []
    for (const note of notes) {
      // Create 2-5 votes per note with different device IDs
      const voteCount = Math.floor(Math.random() * 4) + 2
      for (let i = 0; i < voteCount; i++) {
        votes.push({
          note_id: note.id,
          device_id: `demo-device-${i}-${note.id.slice(0, 8)}`
        })
      }
    }

    if (votes.length > 0) {
      const { error: votesError } = await supabase
        .from('votes')
        .insert(votes)

      if (votesError) {
        console.error('❌ Error creating demo votes:', votesError)
        return
      }

      // Update vote counts
      for (const note of notes) {
        const noteVotes = votes.filter(v => v.note_id === note.id).length
        await supabase
          .from('notes')
          .update({ votes: noteVotes })
          .eq('id', note.id)
      }

      console.log(`✅ Created ${votes.length} demo votes`)
    }

    console.log('🎉 Demo board seeded successfully!')
    console.log(`🔗 Demo board URL: http://localhost:3000/b/${DEMO_BOARD.code}`)
    console.log(`🎯 Presenter URL: http://localhost:3000/presenter/${DEMO_BOARD.code}`)

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

// Run the seed function
seedDemoBoard()
