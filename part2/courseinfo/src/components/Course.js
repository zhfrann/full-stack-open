const Header = ({ course }) => <h2>{course}</h2>

const Total = ({ parts }) => {
    //todo: sum from course exersices
    let total = 0;
    parts.map((part) => {
        total += part.exercises
    })

    //todo: same like before, but this one use reduce() method   *not working yet...
    // const total = parts.reduce((prevValue, currentValue) => { return prevValue + currentValue }, 0)

    return (
        <b>total of exercises {total}</b>
    )
}

const Part = ({ part }) =>
    <p>
        {part.name} {part.exercises}
    </p>

const Content = ({ parts }) =>
    <>
        {parts.map((part) =>
            <Part key={part.id} part={part} />
        )}
    </>

const Course = ({ courses }) => {
    return (
        courses.map((course) =>
            <div key={course.id} >
                <Header course={course.name} />

                <Content parts={course.parts} />

                <Total parts={course.parts} />
            </div>
        )
    )
}

export default Course