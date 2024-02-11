import Cookie from "./cookie.js";
import { create2DArray } from "./utils.js";

/* Classe principale du jeu, c'est une grille de cookies. Le jeu se joue comme
Candy Crush Saga etc... c'est un match-3 game... */
export default class Grille {
  

  constructor(l, c, nbDeCookiesDifferents) {
    this.c = c;
    this.l = l;
    this.cookieDrager;
    this.nbDeCookiesDifferents = nbDeCookiesDifferents;
    this.tabcookies = this.remplirTableauDeCookies(this.nbDeCookiesDifferents)
    this.tabcookies.forEach((cookies) => {
      cookies.forEach((cookie) => {
        cookie.htmlImage.ondragstart = () => {
          console.log(cookie);
          this.cookieDrager = cookie
        }
        cookie.htmlImage.ondragover = (event) => {
          event.preventDefault();
        }
        cookie.htmlImage.ondrop = () => {
          cookie.htmlImage.classList.remove("grilleDragOver")
          this.swappe(this.cookieDrager,cookie);
        }
        cookie.htmlImage.ondragenter = () => {
          cookie.htmlImage.classList.add("grilleDragOver")
        }
        cookie.htmlImage.ondragleave = () => {
          cookie.htmlImage.classList.remove("grilleDragOver")
        }
      });
    });

    this.cookiesCliquees = [];
    this.score = 0
    this.divScore = document.getElementById("score");
/*
    this.buttonChercheLignes = document.getElementById('chercheLigne');
    this.buttonChercheColonne = document.getElementById('chercheColonne');
    this.buttonChercheLignes.addEventListener("click", () =>{
      this.detectMatch3Lignes();
    });
    this.buttonChercheColonne.addEventListener("click", () =>{
      this.detectMatch3Colonnes();
    });*/
/*
    this.buttonChuteColone = document.getElementById('chuteColonne');
    this.buttonChuteColone.addEventListener("click", () =>{
      for(let i = 0; i <this.c;i++){ 
        this.chuteColonne(i);
      }
    });*/

  }

  /**
   * parcours la liste des divs de la grille et affiche les images des cookies
   * correspondant à chaque case. Au passage, à chaque image on va ajouter des
   * écouteurs de click et de drag'n'drop pour pouvoir interagir avec elles
   * et implémenter la logique du jeu.
   */
  showCookies() {
    let caseDivs = document.querySelectorAll("#grille div");

    caseDivs.forEach((div, index) => {
      let ligne = Math.floor(index / this.l);
      let colonne = index % this.c; 

       console.log("On remplit le div index=" + index + " l=" + ligne + " col=" + colonne);

      // on récupère le cookie correspondant à cette case
      let cookie = this.tabcookies[ligne][colonne];
      let img = cookie.htmlImage;

      img.onclick = (event) => {
        console.log("On a cliqué sur la ligne " + ligne + " et la colonne " + colonne);
        //let cookieCliquee = this.getCookieFromLC(ligne, colonne);
        console.log("Le cookie cliqué est de type " + cookie.type);
        // highlight + changer classe CSS
        cookie.selectionnee();
        if(this.cookiesCliquees.length<2)this.cookiesCliquees.push(cookie);
        if(this.cookiesCliquees.length==2){this.swappe(this.cookiesCliquees[0],this.cookiesCliquees[1]); }


      }

      // on affiche l'image dans le div pour la faire apparaitre à l'écran.
      div.appendChild(img);
    });
  }

  // inutile ?
  getCookieFromLC(ligne, colonne) {
    return this.tabcookies[ligne][colonne];
  }
  
  /**
   * Initialisation du niveau de départ. Le paramètre est le nombre de cookies différents
   * dans la grille. 4 types (4 couleurs) = facile de trouver des possibilités de faire
   * des groupes de 3. 5 = niveau moyen, 6 = niveau difficile
   *
   * Améliorations : 1) s'assurer que dans la grille générée il n'y a pas déjà de groupes
   * de trois. 2) S'assurer qu'il y a au moins 1 possibilité de faire un groupe de 3 sinon
   * on a perdu d'entrée. 3) réfléchir à des stratégies pour générer des niveaux plus ou moins
   * difficiles.
   *
   * On verra plus tard pour les améliorations...
   */
  remplirTableauDeCookies(nbDeCookiesDifferents) {
    // A FAIRE
    let tab = create2DArray(9);

    // remplir
    for(let l = 0; l < this.l; l++) {
      for(let c =0; c < this.c; c++) {

        const type = Math.floor(Math.random()*nbDeCookiesDifferents);
        //console.log(type)
        tab[l][c] = new Cookie(type, l, c);
      }
    }

    return tab;
  }

  swappe(c1,c2){
    let distance = Cookie.distance(c1,c2);
    console.log(distance);
    if(distance==1){
      Cookie.swapCookies(c1,c2);

      this.cookiesCliquees = [];
      
    }else if(distance>1){
      c1.deselectionnee();
      c2.deselectionnee();
      this.cookiesCliquees = [];
    }else if (distance ==0){
      this.cookiesCliquees.pop();
    }
    distance = -1;
    console.log("SW");
    this.joue()
  }

  detectMatch3Lignes(){
    let type = "";
    let cpt =0;
    let verifLignes = false;
    console.log("ligne")
    for(let i=0;i<this.l;i++){
      type = "";
      cpt =0;
      for(let j=0;j<this.c;j++){        
        if(this.tabcookies[i][j].type != type){ 
          type = this.tabcookies[i][j].type;
          cpt =1;
        }
        else{
          cpt++;
          if(cpt>=3){
            this.tabcookies[i][j-2].htmlImage.classList.add("cookies-hidden");
            this.tabcookies[i][j-1].htmlImage.classList.add("cookies-hidden");
            this.tabcookies[i][j].htmlImage.classList.add("cookies-hidden");
            this.score+=1;
            this.divScore.textContent = "Score : "+this.score;
            console.log("verif ligne");
            verifLignes = true;
          }
        }
      }
    }
    return verifLignes;
  }

  detectMatch3Colonnes(){
    console.log("colonne")
    let type = "";
    let cpt =0;
    let verifColonne = false;
    for(let j=0; j<this.l; j++){
      type = "";
      cpt = 0;
      for(let i=0;i<this.c;i++){
        if(this.tabcookies[i][j].type != type){ 
          type = this.tabcookies[i][j].type;
          cpt =1;
        }
        else{
          cpt++;
          if(cpt>=3){
            this.tabcookies[i-2][j].htmlImage.classList.add("cookies-hidden");
            this.tabcookies[i-1][j].htmlImage.classList.add("cookies-hidden");
            this.tabcookies[i][j].htmlImage.classList.add("cookies-hidden");
            this.score+=1;
            this.divScore.textContent = "Score : "+this.score;
            console.log("verif colonne");
            verifColonne = true;
          }
        }  
      }
    }
    return verifColonne;
  }

  chuteColonne(colonne){
    let premiereLigneVide;
    let derniereLigneVide;
    let ifChute = true;
    setTimeout(()=>{
      while(ifChute){
        ifChute = false;
        for(let i=this.l-1; i>=0; i--){
          if(this.tabcookies[i][colonne].htmlImage.classList.contains("cookies-hidden") && (i==this.l-1 || !this.tabcookies[i+1][colonne].htmlImage.classList.contains("cookies-hidden"))){
            premiereLigneVide = i;
          }
          if(this.tabcookies[i][colonne].htmlImage.classList.contains("cookies-hidden") && (i==0 ||!this.tabcookies[i-1][colonne].htmlImage.classList.contains("cookies-hidden"))){
            derniereLigneVide = i;
            ifChute = this.compacteColonne(premiereLigneVide,derniereLigneVide,colonne);
            console.log("chute");
            break;
          }
        }
      }
      this.generateCookies(colonne);
    },"250");
  }

  compacteColonne(premiereLigneVide,derniereLigneVide,colonne){
    let index=1;
    if(derniereLigneVide-index<0){
      return false;
    }
    else{
      Cookie.swapCookies(this.tabcookies[premiereLigneVide][colonne],this.tabcookies[derniereLigneVide-index][colonne]);
      this.tabcookies[premiereLigneVide][colonne].htmlImage.classList.remove("cookies-hidden");
      this.tabcookies[derniereLigneVide-index][colonne].htmlImage.classList.add("cookies-hidden");
    }
    return true
  }

  generateCookies(colonne){
    for(let i=this.l-1; i>=0; i--){
      if(this.tabcookies[i][colonne].htmlImage.classList.contains("cookies-hidden")){
        const type = Math.floor(Math.random()*this.nbDeCookiesDifferents);
        this.tabcookies[i][colonne].type=type;
        this.tabcookies[i][colonne].htmlImage.src = Cookie.urlsImagesNormales[this.tabcookies[i][colonne].type]; 
        this.tabcookies[i][colonne].htmlImage.classList.remove("cookies-hidden")
      }
    }
    this.joue();

  }

  joue(){
    let verifLigne = this.detectMatch3Lignes();
    let verifColonne = this.detectMatch3Colonnes();
    if(verifLigne || verifColonne){
      for(let i=0; i<this.c; i++){
        this.chuteColonne(i);
      }
    }
      console.log("joue")
  }

}