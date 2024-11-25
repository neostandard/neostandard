// Needed to avoid TypeScript complaining
const React = {}

function MainButton () {}

module.exports = function TodoList () {
  return (
    <>
      <MainButton
        src='https://i.imgur.com/yXOvdOSs.jpg'
        alt='Hedy Lamarr'
        className='photo'
      />
    </>
  )
}
