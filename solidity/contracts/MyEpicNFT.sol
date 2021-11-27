// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";

import { Base64 } from "./libraries/Base64.sol";

contract MyEpicNFT is ERC721URIStorage {

    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    uint256 private _maxEpicNFTs = 50;

    event NewEpicNFTMinted(address sender, uint256 tokenId);

    struct Flavor {
        string name;
        string color;
    }

    string description = "A NFT that is so delicious!";

    string[][] flavors1 = [["Brownie",    "#795c1f"],
                           ["Cheesecake", "#ebb33b"],
                           ["Cupcake",    "#e08ec1"],
                           ["Apple-Pie",  "#fddc70"],
                           ["Krapfen",    "#d6cc9e"],
                           ["Lime-Pie",   "#7fdd9b"],
                           ["Trifle",     "#bb9138"],
                           ["Muffin",     "#ecb130"],
                           ["Donut",      "#f1a0bf"],
                           ["Souffle",    "#ebbfab"],
                           ["Cookie",     "#977b3d"],
                           ["Pecan-Pie",  "#6b4c29"],
                           ["Eclair",     "#e0dbd0"],
                           ["Tiramisu",   "#634e22"]];

    string[][] flavors2 = [["Vanilla",    "#ffe032"],
                           ["Chocolate",  "#5f4611"],
                           ["Mango",      "#fcd426"],
                           ["Ube",        "#7be5ff"],
                           ["Green-Tea",  "#a4e08d"],
                           ["Mint",       "#baecc0"],
                           ["Yogurt",     "#ecdce4"],
                           ["Almond",     "#835c09"],
                           ["Lemon",      "#faf74e"],
                           ["Amaretto",   "#ebbfab"],
                           ["Hazelnut",   "#8b7952"],
                           ["Cappuccino", "#75684b"],
                           ["Coconut",    "#e0dbd0"],
                           ["Coffee",     "#64490f"]];

    string[][] flavors3 = [["Apple",      "#aedf29"],
                           ["Banana",     "#fde351"],
                           ["Pineapple",  "#ec9d9d"],
                           ["Peach",      "#ec8861"],
                           ["Plum",       "#8daae0"],
                           ["Cherry",     "#f05656"],
                           ["Kiwi",       "#86e25b"],
                           ["Blueberry",  "#74a3fa"],
                           ["Strawberry", "#fc5a5a"],
                           ["Lime",       "#adebab"],
                           ["Raspberry",  "#ec6868"],
                           ["Grape",      "#a6e968"],
                           ["Melon",      "#eb7b7b"],
                           ["Orange",     "#fa9654"]];

    string svg1 = "<?xml version='1.0' encoding='UTF-8' standalone='no'?><svg xmlns:dc='http://purl.org/dc/elements/1.1/' xmlns:cc='http://creativecommons.org/ns#' xmlns:rdf='http://www.w3.org/1999/02/22-rdf-syntax-ns#' xmlns:svg='http://www.w3.org/2000/svg' xmlns='http://www.w3.org/2000/svg' version='1.1' width='500' height='500' viewBox='0 0 200 200'><defs><filter id='filter_shadow' width='1.312' height='1.1386667' x='-0.156' y='-0.069333333' style='color-interpolation-filters:sRGB'><feGaussianBlur id='feGaussianBlur3183' stdDeviation='27.16224' /></filter></defs><g transform='matrix(0.19144224,0,0,0.19144224,13.850996,4.9729054)'><rect y='-25.976145' x='-72.350784' height='1044.7017' width='1044.7015' class='bg' /><path d='m 449.99998,78.494143 c 182.82277,0 195.88153,143.284347 195.88153,248.116617 0,235.05784 -195.88153,613.76214 -195.88153,613.76214 0,0 -195.88154,-378.7043 -195.88154,-613.76214 0,-104.47015 13.05877,-248.116617 195.88154,-248.116617 z' style='fill:#955d18;fill-opacity:0.13653137;filter:url(#filter_shadow)' /><g transform='translate(257.3645,92)'><g style='opacity:0.68000034'><path class='con' d='m 53.09,348.575 141.604,457.7 137.488,-453.16 z' /></g><path class='con' d='m 181.456,760.868 20.704,19.071 -6.625,26.335 z' /><path class='con' d='m 174.555,742.705 54.659,-49.947 18.219,-63.57 -82.816,79.008 z' /><path class='con' d='M 146.602,650.075 280.702,521.12 302.093,453.918 135.907,615.566 Z' /><path class='con' d='m 117.687,556.538 202.901,-197.065 -55.487,-0.909 -159.836,156.2 z' /><path class='con' d='m 152.47,349.483 -73.707,79.916 9.11,32.692 111.803,-108.068 z' /><path class='con' d='M 126.797,583.782 231.974,681.86 220.38,720.91 146.673,650.076 Z' /><path class='con' d='M 73.794,414.869 259.304,591.955 248.537,629.189 92.014,473.897 Z' /><path class='con' d='M 289.118,495.693 277.523,532.926 82.904,347.667 h 57.144 z' /><path class='con' d='m 220.38,350.391 86.129,87.181 11.594,-36.326 -49.69,-52.672 z' /></g><g transform='translate(262.31969,92)'><g><path class='fla1' d='m 345.043,339.024 c 4.384,-12.961 6.741,-26.71 6.741,-40.959 0,-77.643 -69.72,-140.593 -155.749,-140.593 -86.023,0 -155.736,62.95 -155.736,140.593 0,14.249 2.354,27.998 6.737,40.959 -16.424,6.221 -27.959,20.873 -27.959,37.961 0,22.735 20.408,41.156 45.595,41.156 20.561,0 37.958,-12.297 43.622,-29.191 5.692,16.894 23.061,29.191 43.646,29.191 21.233,0 39.044,-13.131 44.095,-30.894 5.069,17.763 22.875,30.894 44.104,30.894 20.598,0 37.966,-12.297 43.654,-29.204 5.664,16.907 23.029,29.204 43.618,29.204 25.184,0 45.591,-18.421 45.591,-41.156 0,-17.088 -11.539,-31.729 -27.959,-37.961' /><path class='fla2' d='m 337.463,251.963 c 2.981,-13.156 3.873,-27.075 2.388,-41.44 C 331.701,132.216 256.113,70.102 171.001,71.799 85.873,73.495 23.488,138.355 31.615,216.656 c 1.5,14.371 5.279,28.192 10.966,41.174 -15.595,6.598 -25.477,21.598 -23.687,38.834 2.382,22.933 24.506,41.108 49.432,40.605 20.366,-0.397 36.273,-13.143 40.104,-30.296 7.406,16.927 25.882,28.987 46.237,28.579 21.026,-0.417 37.271,-14.011 40.413,-32.027 6.872,17.815 25.858,30.716 46.874,30.288 20.391,-0.399 36.278,-13.145 40.138,-30.303 7.376,16.932 25.848,28.994 46.215,28.589 24.913,-0.498 43.168,-19.478 40.797,-42.405 -1.79,-17.238 -14.734,-31.771 -31.641,-37.731' /><path class='fla3' d='m 331.28,181.185 c 4.924,-13.392 7.822,-27.504 8.383,-42.021 3.02,-79.102 -64.55,-140.241 -150.962,-136.529 -86.405,3.7 -158.884,70.841 -161.92,149.95 -0.545,14.513 1.286,28.432 5.18,41.44 -16.742,7.042 -28.907,22.467 -29.574,39.881 -0.882,23.165 18.896,41.057 44.201,39.964 20.659,-0.885 38.593,-14.162 44.951,-31.621 5.061,16.97 22.022,28.747 42.691,27.865 21.345,-0.915 39.739,-15.064 45.51,-33.378 4.389,17.876 21.762,30.489 43.105,29.576 20.671,-0.888 38.6,-14.169 44.961,-31.634 5.043,16.985 22.004,28.762 42.684,27.874 25.293,-1.086 46.505,-20.733 47.4,-43.895 0.663,-17.413 -10.348,-31.83 -26.61,-37.472' /></g></g></g><text text-anchor='middle' x='50%' y='65%' class='tfla'>";
    string svg2 = "</text><text text-anchor='middle' x='50%' y='75%' class='tice'>Ice Cream</text><style> .bg { fill: #ffeea8; } .con { fill: #f8ad48; } .fla1 { fill: ";
    string svg3 = "; } .fla2 { fill: ";
    string svg4 = "; } .fla3 { fill: ";
    string svg5 = "; } .tfla { font: bold 12px Purisa; } .tice { font: 11px Purisa; }</style></svg>";

    constructor() ERC721("ThreeFlavorIceCreamNFT", "3FICECR") {
        console.log("This is my NFT contract. Woah!");
    }

    function makeAnEpicNFT() public {
        // Check if NFTs can still be minted.
        require(
            _tokenIds.current() < _maxEpicNFTs,
            "No more Epic NFTs are available."
        );

        // Get the current tokenId, this starts at 0.
        uint256 newItemId = _tokenIds.current();

        // Randomly grab one flavor from each of the three arrays.
        Flavor memory first = pickRandomFirstFlavor(newItemId);
        Flavor memory second = pickRandomSecondFlavor(newItemId);
        Flavor memory third = pickRandomThirdFlavor(newItemId);
        string memory combinedWord = string(abi.encodePacked(first.name, " ", second.name, " ",
            third.name));

        // Concatenate it all together.
        string memory svg = string(abi.encodePacked(svg1, combinedWord, svg2, first.color, svg3,
            second.color, svg4, third.color, svg5));

        // Create SVG data URI.
        string memory svgUri = string(abi.encodePacked("data:image/svg+xml;base64,",
            Base64.encode(bytes(svg))));

        // Get all the JSON metadata in place.
        string memory token = string(abi.encodePacked(
            '{',
            '"name": "', combinedWord, '", ',
            '"description": "', description, '", ',
            '"image": "', svgUri, '"',
            '}'
        ));

        // Create token data URI.
        string memory tokenUri = string(abi.encodePacked("data:application/json;base64,",
            Base64.encode(bytes(token))));

        console.log("\n--------------------");
        console.log(string(abi.encodePacked("https://nftpreview.0xdev.codes/?code=", tokenUri)));
        console.log("--------------------\n");

        // Actually mint the NFT to the sender using msg.sender.
        _safeMint(msg.sender, newItemId);
    
        // Set the NFTs token URI.
        _setTokenURI(newItemId, tokenUri);
        
        console.log("An Epic NFT with ID %s has been minted to %s.", newItemId, msg.sender);

        // Emit event that a new NFT was minted.
        emit NewEpicNFTMinted(msg.sender, newItemId);
    
        // Increment the counter for when the next NFT is minted.
        _tokenIds.increment();
    }

    function pickRandomFirstFlavor(uint256 tokenId) public view returns (Flavor memory) {
        uint256 rand = random(string(abi.encodePacked("FLAVOR1", Strings.toString(tokenId))));
        rand = rand % flavors1.length;
        return Flavor(flavors1[rand][0], flavors1[rand][1]);
    }

    function pickRandomSecondFlavor(uint256 tokenId) public view returns (Flavor memory) {
        uint256 rand = random(string(abi.encodePacked("FLAVOR2", Strings.toString(tokenId))));
        rand = rand % flavors2.length;
        return Flavor(flavors2[rand][0], flavors2[rand][1]);
    }

    function pickRandomThirdFlavor(uint256 tokenId) public view returns (Flavor memory) {
        uint256 rand = random(string(abi.encodePacked("FLAVOR3", Strings.toString(tokenId))));
        rand = rand % flavors3.length;
        return Flavor(flavors3[rand][0], flavors3[rand][1]);
    }

    function random(string memory input) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(input)));
    }

    function getMaxEpicNFTCount() public view returns (uint256) {
        console.log("Contract can have %d max Epic NFTs.", _maxEpicNFTs);
        return _maxEpicNFTs;
    }

    function getMintedEpicNFTCount() public view returns (uint256) {
        console.log("Contract has %d minted Epic NFTs.", _tokenIds.current());
        return _tokenIds.current();
    }

}
