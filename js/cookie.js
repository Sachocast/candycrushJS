export default class Cookie {
  ligne=0;
  colone=0;
  type=0;
  htmlImage=undefined;

  static urlsImagesNormales = [
    "./assets/images/Croissant@2x.png",
    "./assets/images/Cupcake@2x.png",
    "./assets/images/Danish@2x.png",
    "./assets/images/Donut@2x.png",
    "./assets/images/Macaroon@2x.png",
    "./assets/images/SugarCookie@2x.png",
  ];
  static urlsImagesSurlignees = [
    "./assets/images/Croissant-Highlighted@2x.png",
    "./assets/images/Cupcake-Highlighted@2x.png",
    "./assets/images/Danish-Highlighted@2x.png",
    "./assets/images/Donut-Highlighted@2x.png",
    "./assets/images/Macaroon-Highlighted@2x.png",
    "./assets/images/SugarCookie-Highlighted@2x.png",
  ];

  constructor(type, ligne, colonne) {
    this.type = type;
    this.ligne = ligne;
    this.colonne = colonne;

    const url = Cookie.urlsImagesNormales[type];

    // On crée une image avec le DOM
    let img = document.createElement("img");
    img.src = url;
    img.width = 80;
    img.height = 80;
    // pour pouvoir récupérer la ligne et la colonne
    // quand on cliquera sur une image et donc à partir
    // de cette ligne et colonne on pourra récupérer le cookie
    img.dataset.ligne = ligne;
    img.dataset.colonne = colonne;

    this.htmlImage = img;
    
    this.htmlImage.classList.add("cookies");
    // A FAIRE
  }

  selectionnee() {
      this.htmlImage.src = Cookie.urlsImagesSurlignees[this.type];
      this.htmlImage.classList.add("cookies-selected");
      
  }

  deselectionnee() {
    this.htmlImage.src = Cookie.urlsImagesNormales[this.type]; 
    this.htmlImage.classList.remove("cookies-selected"); 
  }

  static swapCookies(c1, c2) {
    console.log("SWAP C1 C2");
    let typeCookie2 = c2.type;
    c2.type = c1.type;
    c1.type = typeCookie2;
    c1.deselectionnee();
    c2.deselectionnee();
    
  }

  /** renvoie la distance entre deux cookies */
  static distance(cookie1, cookie2) {
    let l1 = cookie1.ligne;
    let c1 = cookie1.colonne;
    let l2 = cookie2.ligne;
    let c2 = cookie2.colonne;

    const distance = Math.sqrt((c2 - c1) * (c2 - c1) + (l2 - l1) * (l2 - l1));
    console.log("Distance = " + distance);
    return distance;
  }

}
