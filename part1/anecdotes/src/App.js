import { useState } from 'react'

const Button = props => {
  return (
    <button onClick={props.handler}>
      {props.text}
    </button>
  )
}

const MostAnecdoteVote = ({ anecdotes, votes }) => {
  // let highestVote = [...votes].sort((a, b) => a - b).pop()
  let highestVote = Math.max(...votes)
  const selectedAnecdote = anecdotes[votes.indexOf(highestVote)]
  console.log('highest vote', highestVote)
  if (highestVote > 0) {
    return (
      <div>
        <p>{selectedAnecdote}</p>
        <p>has {highestVote} votes</p>
      </div>
    )
  }
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))

  const random = (max) => {
    const randomNumber = Math.round(Math.random() * max)
    setSelected(randomNumber)
    console.log(randomNumber)
    console.log(votes)
  }

  const increaseVote = () => {
    const voteCopied = [...votes]   //Note: Using spread syntax inside bracket will create new array
    voteCopied[selected] += 1
    setVotes(voteCopied)
  }

  return (
    <div>
      <h2>Anecdote of the day</h2>
      <p>
        {anecdotes[selected]}
      </p>
      <p>has {votes[selected]} votes</p>

      <Button handler={increaseVote} text="vote" />
      <Button handler={() => { random(anecdotes.length - 1) }} text="next anecdote" />

      <h2>Anecdote with most votes</h2>
      <MostAnecdoteVote anecdotes={anecdotes} votes={votes} />
    </div>
  )
}

export default App