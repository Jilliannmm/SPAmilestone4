 const templates = {
  bookCard: `
    <div class="book" data-id="{{id}}">
      <img src="{{thumbnail}}" alt="{{title}}">
      <p>{{title}}</p>
    </div>
  `,
  bookDetail: `
    <div>
      <h3>{{title}}</h3>
      <img src="{{thumbnail}}">
      <p><strong>Authors:</strong> {{authors}}</p>
      <p><strong>Description:</strong> {{description}}</p>
    </div>
  `
};
