var title = "test";

$('#record-btn').click(function(){
	var title = $('#inputInitials').val();
	console.log(title);
	var posterDropzone = new Dropzone("div#uploadImage", { url: "/adminInfo", headers: { "title": title }, acceptedFiles: "image/*" });
	//var bannerDropzone = new Dropzone("div#uploadBanner", { url: "/admin/banner", headers: { "title": title }, acceptedFiles: "image/*" });
})

// Disable auto discover for all elements:
Dropzone.autoDiscover = false;