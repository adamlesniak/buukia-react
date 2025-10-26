import styled from "styled-components";

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: var(--primary);
`;

export function Header() {
  return (
    <header className="p-4 flex items-center bg-gray-800 text-white shadow-lg">
      <Title>Header</Title>
    </header>
  );
}
