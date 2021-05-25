window.addEventListener('load', function(){

const booksWrapper = document.querySelector('.book-search-result');

class Form{
	constructor(ev){
		this.ev = ev;
		this.ev.addEventListener('submit', this.formSubmit.bind(this));
	}

	async formSubmit(e){
		e.preventDefault();
		let searchInput = document.querySelector('.book-search-input'),
			searchInputValue = searchInput.value;

			if (searchInputValue.length <= "3"){
				searchInput.classList.add("ERROR");
				document.querySelector('.validation').classList.add("active")
				
			} else {
				document.querySelector('.validation').classList.remove("active");
				searchInput.classList.remove("ERROR");
				searchInput.classList.add("searchInput");
				let url = `https://www.googleapis.com/books/v1/volumes?q=${searchInputValue}`;

				let resultDiv = document.querySelector('.book-search-result');
				console.log (resultDiv);
				while(resultDiv.firstChild){
					resultDiv.removeChild(resultDiv.firstChild);
				}

				let book = new Book(await this.getBook(url));
				book.renderBook();
			}
	}

	async getBook(url){
		let response = await fetch(url),
			data = await response.json();
		return data;
	}
}

class Book{
	constructor(data){
		this.data = data;
	}

	renderBook(){
		let book = this.data;
		
		if(book.items && book.items.length>0){
			book.items.forEach(book=>{
				let newBook = new Book(book);
				newBook.renderBook();
			});
		} else {
			console.log(book);
			let bookBlock = document.createElement('div');
			bookBlock.classList.add('book');
			bookBlock.innerHTML = `<div class="book__image"><img src="${book.volumeInfo.imageLinks.thumbnail ? book.volumeInfo.imageLinks.thumbnail : book.volumeInfo.imageLinks.smallThumbnail}"></img></div>
			                      <div class="book__info">
								  <p><b>Title: </b>"${book.volumeInfo.title ? book.volumeInfo.title : "Unknown"}"</p>
			                      <p><b> Authors: </b> ${book.volumeInfo.authors ? book.volumeInfo.authors : "Unknown"} </p>
								  <a href="${book.volumeInfo.infoLink}">Read more</a></div>`;
			booksWrapper.append(bookBlock);
		}
	}
}

let formBook = new Form(
	document.querySelector('#getBook')
)

});
