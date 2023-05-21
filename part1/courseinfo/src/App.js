const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course} />

      <Content contents={course} />

      <Total total={course} />
    </div>
  )
}

const Header = props => {
  console.log(props)

  return (
    <h1>{props.course.name}</h1>
  )
}

const Content = props => {
  console.log(props.contents)

  return (
    <>
      <Part part={props.contents.parts[0]} />
      <Part part={props.contents.parts[1]} />
      <Part part={props.contents.parts[2]} />
    </>
  )
}

const Part = props => {
  // console.log(props)

  return (
    <>
      <p>
        {props.part.name} {props.part.exercises}
      </p>
    </>
  )
}

const Total = props => {
  console.log(props)

  return (
    <p>Number of exercises {props.total.parts[0].exercises + props.total.parts[1].exercises + props.total.parts[2].exercises} </p>
  )
}

export default App