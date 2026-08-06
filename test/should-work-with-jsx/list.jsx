module.exports = function List ({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.label}</li>
      ))}
    </ul>
  )
}
