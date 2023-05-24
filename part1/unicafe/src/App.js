import { useState } from "react";

const Button = ({ feedbackHandler, text }) => {
  return (
    <button onClick={feedbackHandler}>
      {text}
    </button>
  )
}

const Statistics = ({ good, neutral, bad, total }) => {
  if (total !== 0) {
    return (
      <div>
        <table>
          <tbody>
            <StatisticLine text="good" value={good} />
            <StatisticLine text="neutral" value={neutral} />
            <StatisticLine text="bad" value={bad} />
            <StatisticLine text="total" value={total} />
            <StatisticLine text="Average" value={total === 0 ? '' : (good - bad) / total} />
            <StatisticLine text="Positive" value={total === 0 ? '' : 100 * good / total + '%'} />
          </tbody>
        </table>
      </div>
    )
  } else {
    return (
      <div>No feedback given</div>
    )
  }
}

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  // const totalFeedback = good + neutral + bad
  const [total, setTotal] = useState(0)

  const goodFeedback = () => {
    const updatedFeedback = good + 1
    setGood(updatedFeedback)
    setTotal(updatedFeedback + neutral + bad)
  }

  const neutralFeedback = () => {
    const updatedFeedback = neutral + 1
    setNeutral(updatedFeedback)
    setTotal(good + updatedFeedback + bad)
  }

  const badFeedback = () => {
    const updatedFeedback = bad + 1
    setBad(updatedFeedback)
    setTotal(good + neutral + updatedFeedback)
  }

  return (
    <div>
      <h1>Give Feedback</h1>

      <Button feedbackHandler={goodFeedback} text="good" />
      <Button feedbackHandler={neutralFeedback} text="neutral" />
      <Button feedbackHandler={badFeedback} text="bad" />

      <h2>Statistic</h2>

      <Statistics good={good} neutral={neutral} bad={bad} total={total} />
    </div>
  );
};

export default App;
