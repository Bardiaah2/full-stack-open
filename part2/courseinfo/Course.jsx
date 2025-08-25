const Course = ({ course }) => {
  const total = course.parts.reduce((per, cur) => {
    const result = {exercises: per.exercises + cur.exercises}
    return result
  })
  return (
    <>
      <h1 key={course.id}>{course.name}</h1>
      {course.parts.map((part) => <p key={part.id}>{part.name} {part.exercises}</p>)}
      <b>total of {total.exercises} exercises</b>
    </>
  )
}

export default Course