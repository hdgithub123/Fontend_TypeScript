
const link: Record<string, string> = {
  home: "/",
  user: "/user",
  register: "/register"
};



function Sidebar() {
  return (
    <div style={{ width: '200px', background: '#eee', padding: '1rem' }}>
      <ul>
        {Object.entries(link).map(([name, url]) => (
          <li key={name}>
            <a href={url}>{name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;