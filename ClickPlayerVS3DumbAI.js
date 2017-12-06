$(document).ready(function () {
    var player=prompt("Please enter your name.");
    //var player="Sarah";
    var north = new DumbAI("Carol");
    var east = new DumbAI("Bob");
    var south =new ClickPlayer(player, $("#south_player")[0]); 
    var west = new DumbAI("Roy");
    $("#splayerName").append("South: "+player);
    $("#nplayerName").append("North: "+north.getName());
    $("#eplayerName").append("East: "+east.getName());
    $("#wplayerName").append("West: "+west.getName());

    var match = new HeartsMatch(north, east, south, west);

    
    match.run();
});
