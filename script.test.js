describe("Tests ClickFast", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="score">0</div>
      <button id="click-button">Click me!</button>
    `;
  });

  test("Le score augmente après un clic", () => {
    const button = document.getElementById('click-button');
    const score = document.getElementById('score');

    button.click();
    expect(score.innerText).toBe('1');
  });

  test("Le score ne change pas sans clic", () => {
    const score = document.getElementById('score');
    expect(score.innerText).toBe('0');
  });
});
