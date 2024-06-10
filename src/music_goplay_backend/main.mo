import Array "mo:base/Array";

actor MusicList {

  type Music = {
    id : Nat;
    title : Text;
    urlImage : Text;
    artist : Text;
    rating : Nat;
  };

  var musics : [Music] = [
    {
      id = 1;
      title = "Agora Hills";
      urlImage = "";
      artist = "Doja Cat";
      rating = 8;
    }
  ];

  public func addMusic(
    rating : Nat, 
    title : Text, 
    url_image : Text,
    artist : Text
  ) : async Bool {
    let newId = Array.size(musics) + 1;
    let newMusic = {
      id = newId;
      title = title;
      urlImage = url_image;
      artist = artist;
      rating = rating;
    };
    musics := Array.append<Music>(musics, [newMusic]);
    return true;
  };

  public func getMusics() : async [Music] {
    return musics;
  };

  public func getMusicById(id : Nat) : async ?Music {
    return Array.find<Music>(musics, func(m) { m.id == id });
  };

  public func updateMusic(
    id : Nat, 
    title : Text, 
    urlImage : Text,
    artist : Text, 
    rating : Nat
  ) : async Bool {
    let musicToUpdate = Array.find<Music>(musics, func(music) { music.id == id });

    switch (musicToUpdate) {
      case (null) { return false };
      case (?music) {
        let updatedMusic = {
          id = id;
          title = title;
          urlImage = urlImage;
          artist = artist;
          rating = rating;
        };
        musics := Array.map<Music, Music>(musics, func(m) { if (m.id == id) { updatedMusic } else { m } });
        return true;
      };
    };
  };

  public func deleteMusic(id : Nat) : async Bool {
    let music = Array.find<Music>(musics, func(music) { music.id == id });
    if (music != null) {
      musics := Array.filter<Music>(musics, func(music) { music.id != id });
      return true;
    } else {
      return false;
    };
  };
};
