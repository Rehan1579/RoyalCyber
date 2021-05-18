Handlebars.registerHelper('formatDate', function(string) {
	return new Date(string).toDateString();
});

function getUsers()
{
	const url = 'https://5dc588200bbd050014fb8ae1.mockapi.io/assessment'
	fetch(url)
		   .then((res) => res.json())
		   .then((data) => {
			   console.log(data[0]);
			   return {users: data}
		   })
		   .then((data) => {
			   let source = document.getElementById("entry-template").innerHTML;
			   let template = Handlebars.compile(source);
			   document.getElementById('output').innerHTML = template(data);

			   let listItem = document.getElementsByClassName('list-item');
			   for (let i=0; i<listItem.length; ++i)
			   {
			   	listItem[i].addEventListener("click", () => {
			   		let date = new Date(data.users[i].createdAt).toDateString();
			   		let user = `Id: ${data.users[i].id}\nName: ${data.users[i].name}\nDate: ${date}\n`;
					alert(user);
				})
			   }
		   })
		   .catch(() => alert('Error occurred. Try again.'))
}
