function renderArticles(){
	$.getJSON("/articles", function(data) {
  	data.map(function(n){
  	 $(".ArticleCont").append(`<div class = 'artHolder card row justify-content-center'><p class='art col-9' data-id='${n._id}'>${n.title}<br />${n.snip}</p><button class='saveArt btn btn-default' col-3' data-id='${n._id}'>Save!</button></div>`);
  	});
	});
}

function renderComments(article){
	$(".commentList").empty();
	$.getJSON(`/comments/${article}`, function(data){
		console.log(data);
		data[0].comments.map(function(n){
			$(".commentList").append(
				`
					<div class = "row">
						<div class="comment col-9">
							<h6>${n.title}</h6>
							</hr>
							<p>${n.text}<p>
						</div>
						<button data-id="${n._id}" class="commentDelete col-3">x</button>
					</div>
				`);
		});
	});
}

$(document).ready(renderArticles);


$(document).on("click", "#scrape", function(){
	$.ajax({
		method: "GET",
		url: "/scrape"
	}).done(
		function(data){
			$(".ArticleCont").empty();
			renderArticles();
  	}
  );
});

$(document).on("click", ".saveArt", function(){
	console.log($(this).attr('data-id'));
	$.ajax({
		method: "POST",
		url: "/save/" + $(this).attr('data-id')
	})
		.done(function(data){
			console.log(data);
		});
});

$(document).on("click", "#savedArticles", function(){
	$.getJSON("/saved", function(data) {
		console.log(data);
		$(".ArticleCont").empty();
  	data.savedArticles.map(function(n){
  	 $(".ArticleCont").append(`<div class = 'artHolder row justify-content-center'><p class='art col-9' data-id='${n._id}'>${n.title}<br />${n.snip}</p><button class='deleteArt' col-3' data-id='${n._id}'>Delete!!</button></div>`);
  	});
	});
});

$(document).on("click", ".commentDelete", function(){
	console.log($(this).data("id"));
	console.log($("#saveComment").data("id"));
	$.ajax({
		method: "POST",
		url: `/remove/${$(this).data("id")}/${$("#saveComment").data("id")}`
	})
		.then(function(){
			// window.location.reload();
			renderComments($("#saveComment").data("id"));	
	})

	$(this).parent().remove();
});

$(document).on("click", ".deleteArt", function(){
	console.log($(this).data("id"));
	$.ajax({
		method: "POST",
		url: `/remove/${$(this).data("id")}`
	})
	$(this).parent().remove();
});

$(document).on("click", 'p.art', function(event){
	event.preventDefault();
	$('#article-modal').modal('toggle');
	// $(".commentList").empty();
	$('.CommentCont').empty();

	// console.log($(this).attr('data-id'));

	$.ajax({
		method: 'GET',
		url: "/articles/" + $(this).attr('data-id')
	}).done(
		function(data){
			console.log(data);
			renderComments(data._id);
			$('.modal-title').text(data.title);
			$('.CommentCont').append("<input id='titleInput' name= 'title'>");
			$('.CommentCont').append("<textarea id='bodyInput' name='body'></textarea>");
			$('#saveComment').data("id", data._id);
			// $('.CommentCont').append("<button data-id='" + data._id + "' id='saveComment'>Comment</button>");	
		}
	)
});

$(document).on("click", "#saveComment", function() {
	$.ajax({
		method: "POST",
		url: "/articles/" + $(this).data("id"),
		data: {
			title: $("#titleInput").val(),
			text: $("#bodyInput").val()
		}
	})
		.done(function(data){
			console.log(data);
			renderComments(data._id);
			$("#titleInput").val("");
			$("#bodyInput").val("");
			
		})
});