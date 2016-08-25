var userEmail =''; // sets the email to an empty string

if (location.hash.indexOf('album') !== -1) {
  gotoHash();// will go to the album
} else {
  renderHome();// will render the home page
}
// localStorage.clear();

$(window).on('hashchange', gotoHash); // Hash change event

function gotoHash() { // a function deciding the url extinsion
  // console.log('GO TO HASH');
  var albumHash = location.hash.match(/album=.*?(?=&)/g);
  var imageHash = location.hash.match(/image=.*?(?=&)/g);
  if (imageHash !== null) { // when the image location isnt null it renders that image
    albumHash = albumHash[0];
    imageHash = imageHash[0];
    albumIndex = albumHash.split('=')[1];
    imageIndex = imageHash.split('=')[1];
    renderImage(albumIndex, imageIndex); // calls the render image function
  } else if (albumHash !== null) { // if the image is null and the albumhash isnt it displays the album page
    albumHash = albumHash[0];
    albumIndex = albumHash.split('=')[1];
    renderAlbum(albumIndex);// calls the renderAlbum function
  }
}


function renderHome() {
  var $modalContainer = $('.modal-container');  // cashing all the jquery selectors
  var $loginBtn = $('#email-submit');
  var $emailInput = $('#email-input');

  var $logoutBtn = $('.logoutBtn');
  var $myAlbums = $('.myAlbumsPage');
  var $albumPage = $('.album-page');
  var $imagePage = $('.image-page');

  $myAlbums.css('display', 'block'); // Removes the page before it.
  $imagePage.css('display', 'none'); // Removes the page after it.
  $albumPage.css('display', 'none'); // Display this page

  var $albumsGrid = $('.albums-grid');
  $albumsGrid.empty();  // clears the albumsGrid ul when the user performs a hashchange

  if (!sessionStorage.email) {
    $('.modal').css('display', 'none');
    $modalContainer.css('display', 'flex');// checks to see if theres a stored email and
    $('.login').css('display', 'flex');// if not it displays the login popup
  }

  $emailInput.on('keyup', function(e){
    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRegex.test($emailInput.val())) {
      $loginBtn.addClass('valid');
    } else {
      $loginBtn.removeClass('valid');
    }
  });// checks if the email entered is valid and if so it ataches the class to th elogin btn


  $loginBtn.on('click', function(){ // checks to make sure the inputed email meets the character limitations and requirements
    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRegex.test($emailInput.val())) {
      // VALID EMAIL
      userEmail = $emailInput.val();// if the email is valid it stores it and gets rid of the login popup
      sessionStorage.email = $emailInput.val();
      $modalContainer.css('display', 'none');
      $('.modal').css('display', 'none');
    } else {
      // INVALID EMAIL
      $('.login').effect( "shake" );// if not valid it does the shake effect and doesnt let you get pass
    }
  });

  $logoutBtn.on('click', function(){// removes the email from storage and display the log in pop up again
    userEmail = '';
    if (sessionStorage.email) {
      sessionStorage.removeItem('email');
    }
    $modalContainer.css('display', 'flex');
    $('.login').css('display', 'flex');
  });

  var allAlbumNames = [];  // creates an empty array
  data.forEach(function(album) { // pushes each album title to the array
    allAlbumNames.push(album.title);
  });

  if(window.localStorage && localStorage.albums) { // If the user has albums saved.
    var albumsArray = localStorage.getItem('albums'); // if the user has created a new albumit saved in localStorage and is in the albumsArray
    albumsArray = JSON.parse(albumsArray);  // parses for saved albums
    albumsArray.forEach(function(album) {
      if (allAlbumNames.indexOf(album.title) === -1) {
        data.push(album); // pushes the stored album to the array
      }
    });
  }

  data.forEach(function(album, i) {
    var liHTML = '<li class="album"><a href="#"><div class="album-meta"><div><i class="fa fa-heart" aria-hidden="true"></i><i class="fa fa-heart-o" aria-hidden="true"></i><p class="likes">0</p></div><h5 class="Album title">Album Title</h5></div><div class="image-container"></div></a></li>';
    var $li = $(liHTML);
    // Set the BG image
    $li.children('a').children('.image-container').css('background-image', 'url(' + album.images[0] + ')');
    // Set the title
    $li.children('a').children('.album-meta').children('h5').text(album.title);
    $li.children('a').children('.album-meta').children('div').children('p').text(album.likes);
    // Set the data:
    $li.children('a').children('.image-container').attr('data-index', i);

    $albumsGrid.append($li); // appends all the album covers to the my albums page

    // event Listener
    $li.children('a').children('.image-container').on('click', function(e){
      location.hash = 'album=' + $(this).data().index + '&';
      return false; // This prevents the anchor tag href to set the hash
    }); // sets the location.hash to the individual album page

    $li.children('a').children('.album-meta').children('div').on('click', function(){
      var albumIndex = $(this).closest('.album-meta').siblings('.image-container').data().index;
      if ($(this).hasClass('liked')) {
        $(this).removeClass('liked');
        data[albumIndex].likes--;
      } else {
        $(this).addClass('liked');
        data[albumIndex].likes++;
      }
      $(this).children('p').text(data[albumIndex].likes);
    });
  }); // listens for clicks on like button of each album and then incraments or deincraments the given number of likes


  var newAlbumHTML = '<li class="new-album"><div><i class="fa fa-plus" aria-hidden="true"></i><h3>New Album</h3></div></li>';
  $albumsGrid.append($(newAlbumHTML));// creates the album on the my albums page on submission

  var $newAlbum = $('.new-album');

  $newAlbum.on('click',function(){ // displays the modal for creating a new album upon click
    var $albumName = $('.album-name');
    $albumName.val('');
    var $imageInput = $('#album-first-image');
    $imageInput.val('');
    $modalContainer.css('display', 'flex');
    $('.create-album').css('display', 'flex');
    var $submitBtn = $('#album-submit');
    $submitBtn.removeClass('valid');

    $albumName.on('keyup', function(){
      if ($albumName.val() !== '' && $imageInput.val() !== '') {// makes sure the input fields arent empty and then adds the class
        $submitBtn.addClass('valid');
      } else {
        $submitBtn.removeClass('valid');
      }
    });

    $imageInput.on('keyup', function(){
      if ($albumName.val() !== '' && $imageInput.val() !== '') {// makes sure input field isnt empty
        $submitBtn.addClass('valid');
      } else {
        $submitBtn.removeClass('valid');
      }
    });
    $submitBtn.unbind('click'); // checks for both input fields to be filled in and then alows the user to create the album
    $submitBtn.on('click', function(){
      if ($albumName.val() !== '' && $imageInput.val() !== '') {
        var imageURL = $imageInput.val();
        var albumName = $albumName.val();
        var albumsArray = localStorage.getItem('albums');
        albumsArray = JSON.parse(albumsArray);

        if(window.localStorage) { // checks to see if the album name exists
          if (localStorage.albums) { // If albums have been stored
            var albumAlreadyExists = false;
            var allAlbumsArray = [];
            albumsArray.forEach(function(album){
              if (album.title === albumName) { albumAlreadyExists = true; }
            });
            if (!albumAlreadyExists) {  // if the album doesnt exist it creates a new one
              var newAlbumObject = {
                title: albumName,
                likes: 0,
                images: [imageURL]
              };
              albumsArray.push(newAlbumObject);
              localStorage.setItem('albums', JSON.stringify(albumsArray));
              // Render home with the new album
              renderHome();
            } else {
              throw new Error('This album already exists'); // if so it thros the error
            }
          } else {
            var albumObject = { // if there is no albums at all this creates an album
              title: albumName,
              likes: 0,
              images: [imageURL]
            };
            var albums = [albumObject];
            localStorage.setItem('albums', JSON.stringify(albums));// saves all the albums to local storage
          }
        }
        $modalContainer.css('display', 'none');
        $('.modal').css('display', 'none'); // hides the new album modal

        var newLiHTML = '<li class="album"><a href="#"><div class="album-meta"><div><i class="fa fa-heart" aria-hidden="true"></i><i class="fa fa-heart-o" aria-hidden="true"></i><p class="likes">0</p></div><h5 class="Album title">Album Title</h5></div><div class="image-container"></div></a></li>';
        var $newLi = $(newLiHTML);
        // Set the BG image
        $newLi.children('a').children('.image-container').css('background-image', 'url(' + imageURL + ')');
        // Set the title
        $newLi.children('a').children('.album-meta').children('h5').text(albumName);
        $newLi.children('a').children('.album-meta').children('div').children('p').text('0');
        // Set the data:
        $newLi.children('a').children('.image-container').attr('data-index', data.length+albumsArray.length);

        // event Listener
        $newLi.children('a').children('.image-container').on('click', function(e){
          location.hash = 'album=' + $(this).data().index + '&';
          return false; // This prevents the anchor tag href to set the hash
        });// creates the new album on the my album page without refreshing

        $newLi.children('a').children('.album-meta').children('div').on('click', function(){
          var albumIndex = $(this).closest('.album-meta').siblings('.image-container').data().index;
          if ($(this).hasClass('liked')) {
            $(this).removeClass('liked');
            data[albumIndex].likes--;
          } else {
            $(this).addClass('liked');
            data[albumIndex].likes++;
          }
          $(this).children('p').text(data[albumIndex].likes);
        });// keeps track of the likes of newly created albums

      } else { // if the new albums inputs are invalid
        $('#new-album-modal').effect('shake');
      }
    });

    $('.dismiss').one('click', function(){// the exit button on the modal
      $modalContainer.css('display', 'none');
      $('.modal').css('display', 'none');
    });

    $modalContainer.one('click', function(e){ // click out of the modal it exits as well
      if ($(e.target).hasClass('modal-container')) {
        $modalContainer.css('display', 'none');
        $('.modal').css('display', 'none');
      }
    });
  });
}










function renderAlbum(albumIndex) { // albumIndex is a data object with index as a key
  var $modalContainer = $('.modal-container');
  var albumName = data[albumIndex].title;
  var $myAlbums = $('.myAlbumsPage');
  var $albumPage = $('.album-page');
  var $imagePage = $('.image-page');
  var $addImageModal = $('.add-image');
  $myAlbums.css('display', 'none'); // Removes the page before it.
  $imagePage.css('display', 'none'); // Removes the page after it.
  $albumPage.css('display', 'flex'); // Display this page

  $modalContainer.on('click', function(e){
    if ($(e.target).hasClass('modal-container')) {
      $modalContainer.css('display', 'none');
    }
  });

  $('.dismiss').on('click', function() {
    $modalContainer.css('display', 'none');
    $('.modal').css('display', 'none');
  });

  var $sideUl = $('.side-bar div').children('ul');
  $('.album-title').text(data[albumIndex].title); // Set the title
  $('.side-bar a').on('click', function() {
    renderHome();
  });

  var $grid = $('.grid').masonry({
    // options
    itemSelector: '.grid-item',
    columnWidth: ($('.grid').width()/4)-10 // I need this to be the same as calc(100%/4)
  });

  var gridItems = $grid.masonry('getItemElements');

  gridItems.forEach(function(item){
    $grid.masonry( 'remove', item );
  });

  $sideUl.empty();

  data.forEach(function(album, i){
    var sideLiHTML = '<li class="album-link"><a href="#">' + album.title + '</a></li>';
    var $sideLi = $(sideLiHTML);
    $sideLi.attr('data-index', i);

    $sideUl.append($sideLi);

    $sideLi.on('click', function(e){
      renderAlbum($(this).data().index);
    });
  });

  if(window.localStorage && localStorage.albums) { // If the browser supports localstorage
    var albumsArray = localStorage.getItem('albums'); // Get the album object
    albumsArray = JSON.parse(albumsArray); // Parse it with JSON
    var localAlbumIndex = 0;
    var savedAlbumExists = false;
    albumsArray.forEach(function(album, i){
      if (album.title === albumName) {
        localAlbumIndex = i;
        savedAlbumExists = true;
      }
    });
    if (savedAlbumExists) {
      albumsArray[localAlbumIndex].images.forEach(function(imgURL, i) { // Loop through the images array inside it
        if (data[albumIndex].images.indexOf(imgURL) === -1) { // If our data doesn't already have the image
          data[albumIndex].images.push(imgURL); // Add the image to the existing data object.
        }
      });
    }
  }

  $('.album-link:nth-child(' + (Number(albumIndex)+1) + ')').addClass('selected'); // Select our current album

  data[albumIndex].images.forEach(function(image, i){
    appendImage(image, i);
  });

  function appendImage(image, i) {
    var imageHTML = '<div class="grid-item"><img src="' + image + '" alt="" <img/></div>';
    var $image = $(imageHTML);
    $image.attr('data-index', i);
    $image.css('width', ($('.grid').width()/4)-10 + 'px');
    $grid.masonry().append($image).masonry( 'appended', $image ).masonry();

    $image.unbind('click');
    $image.on('click', function(e){
      location.hash = 'album=' + albumIndex + '&image=' + $(this).data().index + '&';
    });
  }

  $grid.imagesLoaded().progress( function() {
    $grid.masonry('layout'); // Layout images after they have been loaded
  });

  $('.add-image-button').on('click', function(){
    $modalContainer.css('display', 'flex');
    $addImageModal.css('display', 'flex');
  });

  $('.image-url').on('keyup', function(){
    if ($(this).val() !== '') {
      $(".submit").addClass('valid');
    } else {
      $(".submit").removeClass('valid');
    }
  });

  $(".submit").unbind('click');
  $('.submit').on('click', function(){
    console.log('CLICKED SUBMIT');
    var imgURL = $('.image-url').val();

    if (imgURL !== '') {
      var albumObject = {
        title: albumName,
        likes: 0,
        images: [imgURL]
      };
      console.log(albumObject);

      if(window.localStorage && localStorage.albums) {
          console.log('Album already exists');
          var albumsArray = localStorage.getItem('albums');
          albumsArray = JSON.parse(albumsArray);
          var savedAlbumExists = false;
          var savedAlbumIndex = 0;

          albumsArray.forEach(function(album, i){
            if (album.title === albumName) {
              savedAlbumExists = true;
              savedAlbumIndex = i;
            }
          });
          if (savedAlbumExists) {
            albumsArray[savedAlbumIndex].images.push(imgURL);
            localStorage.setItem('albums', JSON.stringify(albumsArray));
          } else {
            albumsArray.push(albumObject);
            localStorage.setItem('albums', JSON.stringify(albumsArray));
          }

        } else {
          console.log('Creating new Album file');
          var albums = [albumObject];
          localStorage.setItem('albums', JSON.stringify(albums));
        }
        appendImage(imgURL, data[albumIndex].images.length-1);
        $grid.imagesLoaded().progress( function() {
        $grid.masonry('layout'); // Layout images after they have been loaded
        $modalContainer.css('display', 'none');
        $('.modal').css('display', 'none');
      });
    } else {
      $('.add-image').effect('shake');
    }
  });
}


















function renderImage(albumIndex, imageIndex) {
  var $myAlbums = $('.myAlbumsPage');
  var $albumPage = $('.album-page');
  var $imagePage = $('.image-page');
  $myAlbums.css('display', 'none'); // Removes page
  $albumPage.css('display', 'none'); // Remove page
  $imagePage.css('display', 'flex'); // Display page

  var $slider = $('.slider');
  $slider.empty();
  var autoplay = false;

  var prevImageIndex = imageIndex-1;
  var nextImageIndex = imageIndex+1;

  if (imageIndex === 0) { // If first image:
    prevImageIndex = data[albumIndex].images.length-1;
  } else if (imageIndex === data[albumIndex].images.length-1) { // If last image
    nextImageIndex = 0;
  }

  var currentIndex = imageIndex;
  // Add previous image
  var prevImageHTML = '<li><img src="' + data[albumIndex].images[prevImageIndex] + '" alt="" /><button class="edit-btn" type="button" name="button">Edit Image</button></li>';
  $prevImage = $(prevImageHTML);
  $prevImage.addClass('single_slide');
  $prevImage.addClass('prev');
  $prevImage.attr('data-index', prevImageIndex);
  $slider.append($prevImage);
  // Add current image
  var currImageHTML = '<li><img src="' + data[albumIndex].images[imageIndex] + '" alt="" /><button class="edit-btn" type="button" name="button">Edit Image</button></li>';
  $currImage = $(currImageHTML);
  $currImage.addClass('single_slide');
  $currImage.addClass('curr');
  $currImage.attr('data-index', imageIndex);
  $slider.append($currImage);
  setUpCanvas();

  // Add all other images
  data[albumIndex].images.forEach(function(image, i){
    if (i !== Number(imageIndex) && i !== Number(prevImageIndex)) {
      var imageHTML = '<li><img src="' + data[albumIndex].images[i] + '" alt="" /><button class="edit-btn" type="button" name="button">Edit Image</button></li>';
      $image = $(imageHTML);
      $image.addClass('single_slide');

      if (i === (Number(imageIndex)+1)) {
        $image.addClass('next');
      } else if (Number(imageIndex) === Number(data[albumIndex].images.length)-1 && i === 0) {
        $image.addClass('next');
      }

      $image.attr('data-index', i);
      $slider.append($image);
    }
  });

  $('.edit-btn').on('click', function(){
    var $canvas = $('.canvas');
    $('.modal-container').css('display', 'flex');
    $canvas.css('display', 'flex');
    var imageWidth = $('.curr').children('img').width();
    var imageHeight = $('.curr').children('img').height();
    // $canvas.children('canvas').css('width', imageWidth);
    // $canvas.children('canvas').css('height', imageHeight);
    $canvas.children('canvas').attr('width', imageWidth);
    $canvas.children('canvas').attr('height', imageHeight);
    setUpCanvas();
    //hide cursor
  });

  $('#backToAlbum').on('click', function(){
    // renderAlbum(albumIndex);
    location.hash = 'album=' + albumIndex + '&';
    $slider.empty();
  });

  $('.next').one('click', nextClickHandler);
  $('.prev').one('click', prevClickHandler);


  function nextClickHandler() {
    console.log('next');
    var $prev = $('.single_slide[data-index="' + (Number(currentIndex)-1) + '"]');
    var $curr = $('.single_slide[data-index="' + currentIndex + '"]');
    var $next = $('.single_slide[data-index="' + (Number(currentIndex)+1) + '"]');
    var $newNext = $('.single_slide[data-index="' + (Number(currentIndex)+2) + '"]');

    // Removes all event handlers from other images.
    $slider.children().off();
    $slider.children().removeClass('prev');
    $slider.children().removeClass('curr');
    $slider.children().removeClass('next');

    if (currentIndex === 0) {
      $('.single_slide[data-index="' + '0' + '"]').removeClass('curr').addClass('prev').one('click', prevClickHandler);
      $('.single_slide[data-index="' + (data[albumIndex].images.length-1) + '"]').removeClass('prev');
      $('.single_slide[data-index="' + '1' + '"]').removeClass('next').addClass('curr');
      $newNext.addClass('next').one('click', nextClickHandler);
      currentIndex++;
    } else if (Number(currentIndex) === Number(data[albumIndex].images.length)-1) {
      $('.single_slide[data-index="' + '0' + '"]').removeClass('next').addClass('curr');
      $('.single_slide[data-index="' + '1' + '"]').addClass('next').one('click', nextClickHandler);
      $('.single_slide[data-index="' + (data[albumIndex].images.length-1) + '"]').addClass('prev').removeClass('curr').one('click', prevClickHandler);
      $('.single_slide[data-index="' + (data[albumIndex].images.length-2) + '"]').removeClass('prev');
      currentIndex = 0;
    } else {
      $prev.removeClass('prev');
      $curr.removeClass('curr').addClass('prev').one('click', prevClickHandler);
      $next.removeClass('next').addClass('curr');
      if (Number(currentIndex) === Number(data[albumIndex].images.length)-2) {
        $newNext = $('.single_slide[data-index="' + '0' + '"]');
      }
      $newNext.addClass('next').one('click', nextClickHandler);
      currentIndex++;
    }
  }

  function prevClickHandler() {

    var $newPrev = $('.single_slide[data-index="' + (Number(currentIndex)-2) + '"]');
    var $prev = $('.single_slide[data-index="' + (Number(currentIndex)-1) + '"]');
    var $curr = $('.single_slide[data-index="' + currentIndex + '"]');
    var $next = $('.single_slide[data-index="' + (Number(currentIndex)+1) + '"]');

    // Removes all event handlers from other images.
    $slider.children().off();
    $slider.children().removeClass('prev');
    $slider.children().removeClass('next');
    $slider.children().removeClass('curr');

    if (currentIndex === 0) {
      $('.single_slide[data-index="' + '0' + '"]').removeClass('curr').addClass('next').one('click', nextClickHandler);
      $('.single_slide[data-index="' + '1' + '"]').removeClass('next');
      $('.single_slide[data-index="' + (data[albumIndex].images.length-1) + '"]').addClass('curr').removeClass('prev');
      $('.single_slide[data-index="' + (data[albumIndex].images.length-2) + '"]').addClass('prev').one('click', prevClickHandler);
      $('.single_slide[data-index="' + (data[albumIndex].images.length-3) + '"]').removeClass('prev');
    } else {
      $prev.removeClass('prev').addClass('curr');
      $curr.removeClass('curr').addClass('next').one('click', nextClickHandler);
      $next.removeClass('next');
    }

    if (currentIndex-1 ===  0) { // If the next image is 0
      $newPrev = $('.single_slide[data-index="' + (data[albumIndex].images.length-1) + '"]');
      currentIndex = data[albumIndex].images.length-1;
    } else {
      currentIndex--;
    }
    $newPrev.addClass('prev').one('click', prevClickHandler);
  }

  if (autoplay === true) {
    setInterval(function() {
      nextClickHandler();
    }, 2000);
  }
}







var fillColor = '#fff';
var radius = 5;
var tool = 'brush';

function setUpCanvas() {
  var $smaller = $('.smaller');
  var $bigger = $('.bigger');
  var $eraser = $('.eraser');
  var $tools = $('.tools');
  var $color = $('.color');
  var $doneBtn = $('#done-btn');
  var $hint = $('.hint');
  var $gotHint = $('#gotHint');
  var $textBtn = $('.textBtn');
  var currentColor = 'rgba(255,255,255,1)';

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');

  $tools.children().unbind('click');
  $tools.children().on('click', function(){
    console.log('CLICKY');
    if (!$(this).hasClass('smaller') && !$(this).hasClass('bigger') && !$(this).hasClass('done-btn') && !$(this).hasClass('#gotHint') && !$(this).hasClass('textBtn')) {
      console.log('SHOULD BE ACTIVE');
      $tools.children().removeClass('active');
      $(this).addClass('active');
    }
  });

  $gotHint.on('click', function(){
    $hint.css('display', 'none');
  });

  $doneBtn.on('click',function(){
    console.log('DONE CLICK');
    $('.modal-container').css('display', 'none');
    $('.canvas').css('display', 'none');
  });

  $color.on('click',function(){
    fillColor = $(this).css('backgroundColor');
    tool = 'brush';
    $('#brush').css('border-color', $(this).css('backgroundColor'));
    currentColor = $(this).css('backgroundColor');
  });

  $eraser.on('click',function(){
    tool = 'eraser';
    $('#brush').css('border-color', 'rgba(255,255,255,0.5)');
  });

  $smaller.on('click', function(){
    if (radius > 1) {
      radius--;
      $('#brush').css('border-width', radius + 'px');
    }
  });
  $bigger.on('click', function(){
    radius++;
    $('#brush').css('border-width', radius + 'px');
  });

  var placingText = false;
  $textBtn.on('click',function(){
    placingText = true;
  });

  // var parent = document.getElementById('color1');
  var colorPallete = document.querySelectorAll('.color');

  colorPallete.forEach(function(colorP){
    var picker = new Picker({
      parent: colorP,
      orientation: 'top',
      x: '3px',
      y: '-245px'
    });
    picker.on_done = function(colour) {
      colorP.style.background = colour.rgba().toString();
      fillColor = colour.rgba().toString();
      tool = 'brush';
      $('#brush').css('border-color', colour.rgba().toString());
      $('#picker_wrapper').remove();
    };
    colorP.ondblclick=function(e){
      console.log('DBCLICK');
      picker.show();
      $('#picker_wrapper').css({
        background: '#646464',
      });
      $('#picker_done').css({
        background: '#646464',
        color: '#fff'
      });
      // $('#picker_done').hover($('#picker_done').css('background','#239feb'),$('#picker_done').css('background','#646464'));
      // $('#picker_done').mouseenter($('#picker_done').css('background','#239feb'));
      $('#picker_arrow').css('borderTopColor', '#646464');
      e.preventDefault();
    };
  });



  // define a custom fillCircle method
  ctx.fillCircle = function(x, y, radius, fillColor) {
    ctx.globalCompositeOperation="source-over";
    this.fillStyle = fillColor;
    this.beginPath();
    this.moveTo(x, y);
    this.arc(x, y, radius, 0, Math.PI * 2, false);
    this.fill();
  };

  ctx.eraseCircle = function(x, y, radius, fillColor) {
    ctx.globalCompositeOperation="destination-out";
    this.beginPath();
    this.moveTo(x, y);
    this.arc(x, y, radius, 0, Math.PI * 2, false);
    this.fill();
  };

  var rect = canvas.getBoundingClientRect();

  $('canvas').on('mouseover', function(){
    $('body').css('cursor', 'none');
  });


  document.onmousemove = function(e) {
    if (e.target.id !== 'canvas') {
      $('body').css('cursor', 'default');
      $('#brush').css('display', 'none');
    }
  };

  // bind mouse events
  canvas.onmousemove = function(e) {
    $('#brush').css({
      left: e.pageX + 'px',
      top: e.pageY + 'px',
      display: 'block'
    });
    if (!canvas.isDrawing) {
       return;
    }
    var x = (e.clientX - rect.left) / (rect.right - rect.left) * canvas.width;
    var y = (e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height;
    if (tool === 'brush') {
      ctx.fillCircle(x, y, radius, fillColor);
    } else if (tool === 'eraser') {
      ctx.eraseCircle(x, y, radius);
    }
  };
  canvas.onmousedown = function(e) {
      canvas.isDrawing = true;
      if (placingText) {
        canvas.isDrawing = false;
        placingText = false;
        var inputHTML = '<input class="placedText" type="text">'
        var $placedText = $(inputHTML);
        $placedText.css({
          top: e.pageY + 'px',
          left: e.pageX + 'px',
          transform: 'translateY(-50%)',
          color: currentColor
        });
        $('.canvas').append($placedText);
      }
  };
  canvas.onmouseup = function(e) {
      canvas.isDrawing = false;
  };
}
