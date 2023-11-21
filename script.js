document.addEventListener('DOMContentLoaded', () => {
  const bookForm = document.querySelector('#bookForm');
  bookForm.addEventListener('submit', (e) => {
    e.preventDefault()
    addBook()
    bookForm.reset()
  });
  
  if (storageExist()) {
    loadDataStorage()
  }
});

const books = [];
const renderEV = 'render-books';

function addBook() {
  const judulbuku = document.querySelector('#judul').value;
  const penulis = document.querySelector('#penulis').value;
  const tahun = parseInt(document.querySelector('#tahun').value);
  const id = generateID();
  const read = document.querySelector('.checkBox');
  let isComplete = false;
  if (read.checked) {
    isComplete = true;
  }
  const bookObject = generateObject(id, judulbuku, penulis, tahun, isComplete);
  books.push(bookObject);
  document.dispatchEvent(new Event(renderEV));
  dataSave()
}

function storageExist() {
  if (typeof (Storage) === undefined) {
    const message = document.createElement('p');
    message.innerHTML = 'Browser Tidak Support Local Storage';
    message.classList.add('errMessage');
    const messageCont = document.createElement('div');
    messageCont.classList.add('message-container');
    messageCont.append(message);

    const container = document.querySelector('.container');
    container.insertBefore(messageCont, container.firstChild);
    return false;
  }
  return true;
}

function loadDataStorage() {
  const data = localStorage.getItem('STORAGE_KEY');
  let parsed = JSON.parse(data);
  if (parsed != null) {
    for (const book of parsed){
      books.push(book);
      document.dispatchEvent(new Event(renderEV));
    }
  }
}

function dataSave() {
  if (storageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem('STORAGE_KEY', parsed);
    document.dispatchEvent(new Event(renderEV));
  }
}

function generateID() {
  return +new Date();
}

function generateObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete
  }
}

function makeList(obj) {
  const bookYear = document.createElement('span');
  bookYear.innerHTML = ` (${obj.year})`;
  const bookTitle = document.createElement('h2');
  bookTitle.innerHTML = obj.title;
  bookTitle.innerHTML += bookYear.innerHTML;
  const bookAuthor = document.createElement('p');
  bookAuthor.innerHTML = obj.author;

  const detail = document.createElement('div');
  detail.classList.add('detail');
  detail.append(bookTitle, bookAuthor);
  const actionBtn = document.createElement('div');
  actionBtn.classList.add('actionBtn');

  if (obj.isComplete) {
    const unreadBtn = document.createElement('button');
    unreadBtn.classList.add('unreadBtn');
    unreadBtn.innerHTML = '<i class="fa-solid fa-rotate-left fa-xl"></i>';

    unreadBtn.addEventListener('click', () => {
      unreadBooks(obj.id);
    })

    const removeBtn = document.createElement('button');
    removeBtn.classList.add('removeBtn');
    removeBtn.innerHTML = '<i class="fa-solid fa-trash fa-xl"></i>';

    removeBtn.addEventListener('click', () => {
      if (confirm('Apakah kamu yakin ingin menghapus data?')) {
        removeBooks(obj.id);
        const successMessage = document.createElement('p');
        successMessage.innerHTML = 'Berhasil Menghapus Data';
        successMessage.classList.add('successMessage');
        const successCont = document.createElement('div');
        successCont.classList.add('message-success-container');
        successCont.append(successMessage);

        const container = document.querySelector('.container');
        container.insertBefore(successCont, container.firstChild);

        setTimeout(
          () => {
            successCont.style.display = 'none';
          }, 5000
        )
      }else{
        return;
      }
    })

    actionBtn.append(unreadBtn, removeBtn);
  }else{
    const checkBtn = document.createElement('button');
    checkBtn.classList.add('checkBtn');
    checkBtn.innerHTML = '<i class="fa-solid fa-check fa-xl"></i>';

    checkBtn.addEventListener('click', () => {
      readBooks(obj.id);
    })

    const removeBtn = document.createElement('button');
    removeBtn.classList.add('removeBtn');
    removeBtn.innerHTML = '<i class="fa-solid fa-trash fa-xl"></i>';

    removeBtn.addEventListener('click', () => {
      if (confirm('Apakah kamu yakin ingin menghapus data?')) {
        removeBooks(obj.id);
        const successMessage = document.createElement('p');
        successMessage.innerHTML = 'Berhasil Menghapus Data';
        successMessage.classList.add('successMessage');
        const successCont = document.createElement('div');
        successCont.classList.add('message-success-container');
        successCont.append(successMessage);

        const container = document.querySelector('.container');
        container.insertBefore(successCont, container.firstChild);

        setTimeout(
          () => {
            successCont.style.display = 'none';
          }, 5000
        )
      }else{
        return;
      }
    })

    actionBtn.append(checkBtn, removeBtn);
  }

  const contentParent = document.createElement('div');
  contentParent.classList.add('content-parent');
  contentParent.setAttribute('id', `book_${obj.id}`);
  contentParent.append(detail, actionBtn);

  return contentParent;
}

function readBooks(id) {
  const bookTarget = findBooks(id);

  if (bookTarget == null) {
    return;
  }

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(renderEV));
  dataSave()
}

function unreadBooks(id) {
  const bookTarget = findBooks(id);
  
  if (bookTarget == null) {
    return;
  }

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(renderEV));
  dataSave()
}

function removeBooks(id) {
  const bookTarget = findIndex(id);

  if (bookTarget === -1) {
    return;
  }

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(renderEV));
  dataSave()
}

function findIndex(id) {
  for (const idx in books){
    if (books[idx].id === id) {
      return idx;
    }
  }

  return -1;
}

function findBooks(id) {
  for (const book of books) {
    if (book.id == id) {
      return book;
    }
  }
  return null
}

document.addEventListener(renderEV, () => {
  const notReadList = document.getElementById('notRead');
  notReadList.innerHTML = '';
  
  const hasRead = document.getElementById('hasRead');
  hasRead.innerHTML = '';

  for (const notReadItem of books){
    const notReadEl = makeList(notReadItem);
    if (!notReadItem.isComplete) { 
      notReadList.append(notReadEl);
    }else{
      hasRead.append(notReadEl);
    }
  }
})

const switchLabel = document.querySelector('.switch-label');

switchLabel.addEventListener('click', () => {
  if (switchLabel.querySelector('.checkBox').checked) {
    switchLabel.classList.add('active');
  }else{
    switchLabel.classList.remove('active');
  }
})

const searchInput = document.querySelector('#searchBook');
searchInput.addEventListener('keyup', () => {
  searchBooks(searchInput.value);
  dispatchEvent(new Event(renderEV))
})

function searchBooks(input) {
  content = document.querySelectorAll('.content-parent');
  for (let i  = 0; i < content.length; i++) {
    const element = content[i].querySelector('.detail h2').innerText.toUpperCase();
    if (element.indexOf(input.toUpperCase()) > -1){
      content[i].style.display = ""
    }else{
      content[i].style.display = "none"
    }
  }
}