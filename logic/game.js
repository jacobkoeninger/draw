"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var util = require('util');
var setTimeoutPromise = util.promisify(setTimeout);
var io;
var games = [];
;
var wordLists = [];
wordLists['misc'] = ["a", "ability", "able", "about", "above", "abroad", "absence", "absent", "absolute", "accept", "accident", "accord", "account", "accuse", "accustom", "ache", "across", "act", "action", "active", "actor", "actress", "actual", "add", "address", "admire", "admission", "admit", "adopt", "adoption", "advance", "advantage", "adventure", "advertise", "advice", "advise", "affair", "afford", "afraid", "after", "afternoon", "again", "against", "age", "agency", "agent", "ago", "agree", "agriculture", "ahead", "aim", "air", "airplane", "alike", "alive", "all", "allow", "allowance", "almost", "alone", "along", "aloud", "already", "also", "although", "altogether", "always", "ambition", "ambitious", "among", "amongst", "amount", "amuse", "ancient", "and", "anger", "angle", "angry", "animal", "annoy", "annoyance", "another", "answer", "anxiety", "anxious", "any", "anybody", "anyhow", "anyone", "anything", "anyway", "anywhere", "apart", "apology", "appear", "appearance", "applaud", "applause", "apple", "application", "apply", "appoint", "approve", "arch", "argue", "arise", "arm", "army", "around", "arrange", "arrest", "arrive", "arrow", "art", "article", "artificial", "as", "ash", "ashamed", "aside", "ask", "asleep", "association", "astonish", "at", "attack", "attempt", "attend", "attention", "attentive", "attract", "attraction", "attractive", "audience", "aunt", "autumn", "avenue", "average", "avoid", "avoidance", "awake", "away", "awkward", "axe", "baby", "back", "backward", "bad", "bag", "baggage", "bake", "balance", "ball", "band", "bank", "bar", "barber", "bare", "bargain", "barrel", "base", "basic", "basin", "basis", "basket", "bath", "bathe", "battery", "battle", "bay", "be", "beak", "beam", "bean", "bear", "beard", "beast", "beat", "beauty", "because", "become", "bed", "bedroom", "before", "beg", "begin", "behave", "behavior", "behind", "being", "belief", "believe", "bell", "belong", "below", "belt", "bend", "beneath", "berry", "beside", "besides", "best", "better", "between", "beyond", "bicycle", "big", "bill", "bind", "bird", "birth", "bit", "bite", "bitter", "black", "blade", "blame", "bleed", "bless", "blind", "block", "blood", "blow", "blue", "board", "boast", "boat", "body", "boil", "bold", "bone", "book", "border", "borrow", "both", "bottle", "bottom", "bound", "boundary", "bow", "bowl", "box", "boy", "brain", "branch", "brass", "brave", "bravery", "bread", "breadth", "break", "breakfast", "breath", "breathe", "bribe", "bribery", "brick", "bridge", "bright", "brighten", "bring", "broad", "broadcast", "brother", "brown", "brush", "bucket", "build", "bunch", "bundle", "burn", "burst", "bury", "bus", "bush", "business", "businesslike", "businessman", "busy", "but", "butter", "button", "buy", "by", "cage", "cake", "calculate", "calculation", "calculator", "call", "calm", "camera", "camp", "can", "canal", "cap", "cape", "capital", "captain", "car", "card", "care", "carriage", "carry", "cart", "case", "castle", "cat", "catch", "cattle", "cause", "caution", "cautious", "cave", "cent", "center", "century", "ceremony", "certain", "certainty", "chain", "chair", "chairman", "chalk", "chance", "change", "character", "charge", "charm", "cheap", "cheat", "check", "cheer", "cheese", "chest", "chicken", "chief", "child", "childhood", "chimney", "choice", "choose", "christmas", "church", "circle", "circular", "citizen", "city", "civilize", "claim", "class", "classification", "classify", "clay", "clean", "clear", "clerk", "clever", "cliff", "climb", "clock", "close", "cloth", "clothe", "cloud", "club", "coal", "coarse", "coast", "coat", "coffee", "coin", "cold", "collar", "collect", "collection", "collector", "college", "colony", "color", "comb", "combine", "come", "comfort", "command", "commerce", "commercial", "committee", "common", "companion", "companionship", "company", "compare", "comparison", "compete", "competition", "competitor", "complain", "complaint", "complete", "completion", "complicate", "complication", "compose", "composition", "concern", "condition", "confess", "confession", "confidence", "confident", "confidential", "confuse", "confusion", "congratulate", "congratulation", "connect", "connection", "conquer", "conqueror", "conquest", "conscience", "conscious", "consider", "contain", "content", "continue", "control", "convenience", "convenient", "conversation", "cook", "cool", "copper", "copy", "cork", "corn", "corner", "correct", "correction", "cost", "cottage", "cotton", "cough", "could", "council", "count", "country", "courage", "course", "court", "cousin", "cover", "cow", "coward", "cowardice", "crack", "crash", "cream", "creature", "creep", "crime", "criminal", "critic", "crop", "cross", "crowd", "crown", "cruel", "crush", "cry", "cultivate", "cultivation", "cultivator", "cup", "cupboard", "cure", "curious", "curl", "current", "curse", "curtain", "curve", "cushion", "custom", "customary", "customer", "cut", "daily", "damage", "damp", "dance", "danger", "dare", "dark", "darken", "date", "daughter", "day", "daylight", "dead", "deaf", "deafen", "deal", "dear", "death", "debt", "decay", "deceit", "deceive", "decide", "decision", "decisive", "declare", "decrease", "deed", "deep", "deepen", "deer", "defeat", "defend", "defendant", "defense", "degree", "delay", "delicate", "delight", "deliver", "delivery", "demand", "department", "depend", "dependence", "dependent", "depth", "descend", "descendant", "descent", "describe", "description", "desert", "deserve", "desire", "desk", "despair", "destroy", "destruction", "destructive", "detail", "determine", "develop", "devil", "diamond", "dictionary", "die", "difference", "different", "difficult", "difficulty", "dig", "dine", "dinner", "dip", "direct", "direction", "director", "dirt", "disagree", "disappear", "disappearance", "disappoint", "disapprove", "discipline", "discomfort", "discontent", "discover", "discovery", "discuss", "discussion", "disease", "disgust", "dish", "dismiss", "disregard", "disrespect", "dissatisfaction", "dissatisfy", "distance", "distant", "distinguish", "district", "disturb", "ditch", "dive", "divide", "division", "do", "doctor", "dog", "dollar", "donkey", "door", "dot", "double", "doubt", "down", "dozen", "drag", "draw", "drawer", "dream", "dress", "drink", "drive", "drop", "drown", "drum", "dry", "duck", "due", "dull", "during", "dust", "duty", "each", "eager", "ear", "early", "earn", "earnest", "earth", "ease", "east", "eastern", "easy", "eat", "edge", "educate", "education", "educator", "effect", "effective", "efficiency", "efficient", "effort", "egg", "either", "elastic", "elder", "elect", "election", "electric", "electrician", "elephant", "else", "elsewhere", "empire", "employ", "employee", "empty", "enclose", "enclosure", "encourage", "end", "enemy", "engine", "engineer", "english", "enjoy", "enough", "enter", "entertain", "entire", "entrance", "envelope", "envy", "equal", "escape", "especially", "essence", "essential", "even", "evening", "event", "ever", "everlasting", "every", "everybody", "everyday", "everyone", "everything", "everywhere", "evil", "exact", "examine", "example", "excellence", "excellent", "except", "exception", "excess", "excessive", "exchange", "excite", "excuse", "exercise", "exist", "existence", "expect", "expense", "expensive", "experience", "experiment", "explain", "explode", "explore", "explosion", "explosive", "express", "expression", "extend", "extension", "extensive", "extent", "extra", "extraordinary", "extreme", "eye", "face", "fact", "factory", "fade", "fail", "failure", "faint", "fair", "faith", "fall", "FALSE", "fame", "familiar", "family", "fan", "fancy", "far", "farm", "fashion", "fast", "fasten", "fat", "fate", "father", "fatten", "fault", "favor", "favorite", "fear", "feast", "feather", "feed", "feel", "fellow", "fellowship", "female", "fence", "fever", "few", "field", "fierce", "fight", "figure", "fill", "film", "find", "fine", "finger", "finish", "fire", "firm", "first", "fish", "fit", "fix", "flag", "flame", "flash", "flat", "flatten", "flavor", "flesh", "float", "flood", "floor", "flour", "flow", "flower", "fly", "fold", "follow", "fond", "food", "fool", "foot", "for", "forbid", "force", "foreign", "forest", "forget", "forgive", "fork", "form", "formal", "former", "forth", "fortunate", "fortune", "forward", "frame", "framework", "free", "freedom", "freeze", "frequency", "frequent", "fresh", "friend", "friendly", "friendship", "fright", "frighten", "from", "front", "fruit", "fry", "full", "fun", "funeral", "funny", "fur", "furnish", "furniture", "further", "future", "gaiety", "gain", "gallon", "game", "gap", "garage", "garden", "gas", "gate", "gather", "gay", "general", "generous", "gentle", "gentleman", "get", "gift", "girl", "give", "glad", "glass", "glory", "go", "goat", "god", "gold", "golden", "good", "govern", "governor", "grace", "gradual", "grain", "grammar", "grammatical", "grand", "grass", "grateful", "grave", "gray", "grease", "great", "greed", "green", "greet", "grind", "ground", "group", "grow", "growth", "guard", "guess", "guest", "guide", "guilt", "gun", "habit", "hair", "half", "hall", "hammer", "hand", "handkerchief", "handle", "handshake", "handwriting", "hang", "happen", "happy", "harbor", "hard", "harden", "hardly", "harm", "harvest", "haste", "hasten", "hat", "hate", "hatred", "have", "hay", "he", "head", "headache", "headdress", "heal", "health", "heap", "hear", "heart", "heat", "heaven", "heavenly", "heavy", "height", "heighten", "hello", "help", "here", "hesitate", "hesitation", "hide", "high", "highway", "hill", "hinder", "hindrance", "hire", "history", "hit", "hold", "hole", "holiday", "hollow", "holy", "home", "homecoming", "homemade", "homework", "honest", "honesty", "honor", "hook", "hope", "horizon", "horizontal", "horse", "hospital", "host", "hot", "hotel", "hour", "house", "how", "however", "human", "humble", "hunger", "hunt", "hurrah", "hurry", "hurt", "husband", "hut", "I", "ice", "idea", "ideal", "idle", "if", "ill", "imaginary", "imaginative", "imagine", "imitate", "imitation", "immediate", "immense", "importance", "important", "impossible", "improve", "in", "inch", "include", "inclusive", "increase", "indeed", "indoor", "industry", "influence", "influential", "inform", "ink", "inn", "inquire", "inquiry", "insect", "inside", "instant", "instead", "instrument", "insult", "insurance", "insure", "intend", "intention", "interest", "interfere", "interference", "international", "interrupt", "interruption", "into", "introduce", "introduction", "invent", "invention", "inventor", "invite", "inward", "iron", "island", "it", "jaw", "jealous", "jealousy", "jewel", "join", "joint", "joke", "journey", "joy", "judge", "juice", "jump", "just", "justice", "keep", "key", "kick", "kill", "kind", "king", "kingdom", "kiss", "kitchen", "knee", "kneel", "knife", "knock", "knot", "know", "knowledge", "lack", "ladder", "lady", "lake", "lamp", "land", "landlord", "language", "large", "last", "late", "lately", "latter", "laugh", "laughter", "law", "lawyer", "lay", "lazy", "lead", "leadership", "leaf", "lean", "learn", "least", "leather", "leave", "left", "leg", "lend", "length", "lengthen", "less", "lessen", "lesson", "let", "letter", "level", "liar", "liberty", "librarian", "library", "lid", "lie", "life", "lift", "light", "lighten", "like", "likely", "limb", "limit", "line", "lip", "lipstick", "liquid", "list", "listen", "literary", "literature", "little", "live", "load", "loaf", "loan", "local", "lock", "lodge", "log", "lonely", "long", "look", "loose", "loosen", "lord", "lose", "loss", "lot", "loud", "love", "lovely", "low", "loyal", "loyalty", "luck", "lump", "lunch", "lung", "machine", "machinery", "mad", "madden", "mail", "main", "make", "male", "man", "manage", "mankind", "manner", "manufacture", "many", "map", "march", "mark", "market", "marriage", "marry", "mass", "master", "mat", "match", "material", "matter", "may", "maybe", "meal", "mean", "meantime", "meanwhile", "measure", "meat", "mechanic", "mechanism", "medical", "medicine", "meet", "melt", "member", "membership", "memory", "mend", "mention", "merchant", "mercy", "mere", "merry", "message", "messenger", "metal", "middle", "might", "mild", "mile", "milk", "mill", "mind", "mine", "mineral", "minister", "minute", "miserable", "misery", "miss", "mistake", "mix", "mixture", "model", "moderate", "moderation", "modern", "modest", "modesty", "moment", "momentary", "money", "monkey", "month", "moon", "moonlight", "moral", "more", "moreover", "morning", "most", "mother", "motherhood", "motherly", "motion", "motor", "mountain", "mouse", "mouth", "move", "much", "mud", "multiplication", "multiply", "murder", "music", "musician", "must", "mystery", "nail", "name", "narrow", "nation", "native", "nature", "near", "neat", "necessary", "necessity", "neck", "need", "needle", "neglect", "neighbor", "neighborhood", "neither", "nephew", "nest", "net", "network", "never", "new", "news", "newspaper", "next", "nice", "niece", "night", "no", "noble", "nobody", "noise", "none", "noon", "nor", "north", "northern", "nose", "not", "note", "notebook", "nothing", "notice", "noun", "now", "nowadays", "nowhere", "nuisance", "number", "numerous", "nurse", "nursery", "nut", "oar", "obedience", "obedient", "obey", "object", "objection", "observe", "occasion", "ocean", "of", "off", "offend", "offense", "offer", "office", "officer", "official", "often", "oil", "old", "old-fashioned", "omission", "omit", "on", "once", "one", "only", "onto", "open", "operate", "operation", "operator", "opinion", "opportunity", "oppose", "opposite", "opposition", "or", "orange", "order", "ordinary", "organ", "organize", "origin", "ornament", "other", "otherwise", "ought", "ounce", "out", "outline", "outside", "outward", "over", "overcome", "overflow", "owe", "own", "ownership", "pack", "package", "pad", "page", "pain", "paint", "pair", "pale", "pan", "paper", "parcel", "pardon", "parent", "park", "part", "particle", "particular", "partner", "party", "pass", "passage", "passenger", "past", "paste", "pastry", "path", "patience", "patient", "patriotic", "pattern", "pause", "paw", "pay", "peace", "pearl", "peculiar", "pen", "pencil", "penny", "people", "per", "perfect", "perfection", "perform", "performance", "perhaps", "permanent", "permission", "permit", "person", "persuade", "persuasion", "pet", "photograph", "photography", "pick", "picture", "piece", "pig", "pigeon", "pile", "pin", "pinch", "pink", "pint", "pipe", "pity", "place", "plain", "plan", "plant", "plaster", "plate", "play", "pleasant", "please", "pleasure", "plenty", "plow", "plural", "pocket", "poem", "poet", "point", "poison", "police", "polish", "polite", "political", "politician", "politics", "pool", "poor", "popular", "population", "position", "possess", "possession", "possessor", "possible", "post", "postpone", "pot", "pound", "pour", "poverty", "powder", "power", "practical", "practice", "praise", "pray", "preach", "precious", "prefer", "preference", "prejudice", "prepare", "presence", "present", "preserve", "president", "press", "pressure", "pretend", "pretense", "pretty", "prevent", "prevention", "price", "pride", "priest", "print", "prison", "private", "prize", "probable", "problem", "procession", "produce", "product", "production", "profession", "profit", "program", "progress", "promise", "prompt", "pronounce", "pronunciation", "proof", "proper", "property", "proposal", "propose", "protect", "protection", "proud", "prove", "provide", "public", "pull", "pump", "punctual", "punish", "pupil", "pure", "purple", "purpose", "push", "put", "puzzle", "qualification", "qualify", "quality", "quantity", "quarrel", "quart", "quarter", "queen", "question", "quick", "quiet", "quite", "rabbit", "race", "radio", "rail", "railroad", "rain", "raise", "rake", "rank", "rapid", "rare", "rate", "rather", "raw", "ray", "razor", "reach", "read", "ready", "real", "realize", "reason", "reasonable", "receipt", "receive", "recent", "recognition", "recognize", "recommend", "record", "red", "redden", "reduce", "reduction", "refer", "reference", "reflect", "reflection", "refresh", "refuse", "regard", "regret", "regular", "rejoice", "relate", "relation", "relative", "relief", "relieve", "religion", "remain", "remark", "remedy", "remember", "remind", "rent", "repair", "repeat", "repetition", "replace", "reply", "report", "represent", "representative", "reproduce", "reproduction", "republic", "reputation", "request", "rescue", "reserve", "resign", "resist", "resistance", "respect", "responsible", "rest", "restaurant", "result", "retire", "return", "revenge", "review", "reward", "ribbon", "rice", "rich", "rid", "ride", "right", "ring", "ripe", "ripen", "rise", "risk", "rival", "rivalry", "river", "road", "roar", "roast", "rob", "robbery", "rock", "rod", "roll", "roof", "room", "root", "rope", "rot", "rotten", "rough", "round", "row", "royal", "royalty", "rub", "rubber", "rubbish", "rude", "rug", "ruin", "rule", "run", "rush", "rust", "sacred", "sacrifice", "sad", "sadden", "saddle", "safe", "safety", "sail", "sailor", "sake", "salary", "sale", "salesman", "salt", "same", "sample", "sand", "satisfaction", "satisfactory", "satisfy", "sauce", "saucer", "save", "saw", "say", "scale", "scarce", "scatter", "scene", "scenery", "scent", "school", "science", "scientific", "scientist", "scissors", "scold", "scorn", "scrape", "scratch", "screen", "screw", "sea", "search", "season", "seat", "second", "secrecy", "secret", "secretary", "see", "seed", "seem", "seize", "seldom", "self", "selfish", "sell", "send", "sense", "sensitive", "sentence", "separate", "separation", "serious", "servant", "serve", "service", "set", "settle", "several", "severe", "sew", "shade", "shadow", "shake", "shall", "shallow", "shame", "shape", "share", "sharp", "sharpen", "shave", "she", "sheep", "sheet", "shelf", "shell", "shelter", "shield", "shilling", "shine", "ship", "shirt", "shock", "shoe", "shoot", "shop", "shore", "short", "shorten", "should", "shoulder", "shout", "show", "shower", "shut", "sick", "side", "sight", "sign", "signal", "signature", "silence", "silent", "silk", "silver", "simple", "simplicity", "since", "sincere", "sing", "single", "sink", "sir", "sister", "sit", "situation", "size", "skill", "skin", "skirt", "sky", "slave", "slavery", "sleep", "slide", "slight", "slip", "slippery", "slope", "slow", "small", "smell", "smile", "smoke", "smooth", "snake", "snow", "so", "soap", "social", "society", "sock", "soft", "soften", "soil", "soldier", "solemn", "solid", "solution", "solve", "some", "somebody", "somehow", "someone", "something", "sometime", "sometimes", "somewhere", "son", "song", "soon", "sore", "sorrow", "sorry", "sort", "soul", "sound", "soup", "sour", "south", "sow", "space", "spade", "spare", "speak", "special", "speech", "speed", "spell", "spend", "spill", "spin", "spirit", "spit", "spite", "splendid", "split", "spoil", "spoon", "sport", "spot", "spread", "spring", "square", "staff", "stage", "stain", "stair", "stamp", "stand", "standard", "staple", "star", "start", "state", "station", "stay", "steady", "steam", "steel", "steep", "steer", "stem", "step", "stick", "stiff", "stiffen", "still", "sting", "stir", "stock", "stocking", "stomach", "stone", "stop", "store", "storm", "story", "stove", "straight", "straighten", "strange", "strap", "straw", "stream", "street", "strength", "strengthen", "stretch", "strict", "strike", "string", "strip", "stripe", "stroke", "strong", "struggle", "student", "study", "stuff", "stupid", "subject", "substance", "succeed", "success", "such", "suck", "sudden", "suffer", "sugar", "suggest", "suggestion", "suit", "summer", "sun", "supper", "supply", "support", "suppose", "sure", "surface", "surprise", "surround", "suspect", "suspicion", "suspicious", "swallow", "swear", "sweat", "sweep", "sweet", "sweeten", "swell", "swim", "swing", "sword", "sympathetic", "sympathy", "system", "table", "tail", "tailor", "take", "talk", "tall", "tame", "tap", "taste", "tax", "taxi", "tea", "teach", "tear", "telegraph", "telephone", "tell", "temper", "temperature", "temple", "tempt", "tend", "tender", "tent", "term", "terrible", "test", "than", "thank", "that", "the", "theater", "theatrical", "then", "there", "therefore", "these", "they", "thick", "thicken", "thief", "thin", "thing", "think", "thirst", "this", "thorn", "thorough", "those", "though", "thread", "threat", "threaten", "throat", "through", "throw", "thumb", "thunder", "thus", "ticket", "tide", "tidy", "tie", "tight", "tighten", "till", "time", "tin", "tip", "tire", "title", "to", "tobacco", "today", "toe", "together", "tomorrow", "ton", "tongue", "tonight", "too", "tool", "tooth", "top", "total", "touch", "tough", "tour", "toward", "towel", "tower", "town", "toy", "track", "trade", "train", "translate", "translation", "translator", "trap", "travel", "tray", "treasure", "treasury", "treat", "tree", "tremble", "trial", "tribe", "trick", "trip", "trouble", "true", "trunk", "trust", "truth", "try", "tube", "tune", "turn", "twist", "type", "ugly", "umbrella", "uncle", "under", "underneath", "understand", "union", "unit", "unite", "unity", "universal", "universe", "university", "unless", "until", "up", "upon", "upper", "uppermost", "upright", "upset", "urge", "urgent", "use", "usual", "vain", "valley", "valuable", "value", "variety", "various", "veil", "verb", "verse", "very", "vessel", "victory", "view", "village", "violence", "violent", "virtue", "visit", "visitor", "voice", "vote", "vowel", "voyage", "wage", "waist", "wait", "waiter", "wake", "walk", "wall", "wander", "want", "war", "warm", "warmth", "warn", "wash", "waste", "watch", "water", "wave", "wax", "way", "we", "weak", "weaken", "wealth", "weapon", "wear", "weather", "weave", "weed", "week", "weekday", "weekend", "weigh", "weight", "welcome", "well", "west", "western", "wet", "what", "whatever", "wheat", "wheel", "when", "whenever", "where", "wherever", "whether", "which", "whichever", "while", "whip", "whisper", "whistle", "white", "whiten", "who", "whoever", "whole", "whom", "whose", "why", "wicked", "wide", "widen", "widow", "widower", "width", "wife", "wild", "will", "win", "wind", "window", "wine", "wing", "winter", "wipe", "wire", "wisdom", "wise", "wish", "with", "within", "without", "witness", "woman", "wonder", "wood", "wooden", "wool", "woolen", "word", "work", "world", "worm", "worry", "worse", "worship", "worth", "would", "wound", "wrap", "wreck", "wrist", "write", "wrong", "yard", "year", "yellow", "yes", "yesterday", "yet", "yield", "you", "young", "youth", "zero"];
function notifySocket(type, message, description, socketId) {
    io.to(socketId).emit('notification', {
        type: type,
        message: message,
        description: description
    });
}
var Game = /** @class */ (function () {
    function Game(host, room, words, max_rounds, max_players, round_length) {
        var _this = this;
        this.lobby = function () {
            console.log('Game created');
            // join the host the lobby         
            /*
                TODO:
                - start game when host clicks start button
            */
        };
        this.startGame = function () {
            console.log('Starting game: ' + _this.room);
            _this.players.forEach(function (player) { return player.points = 0; });
            if (_this.status === "active") {
                notifySocket('error', "Game is already active", "", _this.host.id);
                return;
            }
            if (_this.players.length < 2) {
                notifySocket('error', 'Unable to start game', 'Not enough players. At least 2 players needed', _this.host.id);
                return;
            }
            _this.player_turns = (function () {
                var players = _this.players;
                return players.sort(function () { return Math.random() - 0.5; });
            })();
            _this.status = "active";
            _this.startRound();
        };
        this.updateCorrectPlayers = function (player) {
            _this.correct_players.push(player);
            _this.updateClients();
            var guesser_award = Math.floor(100 / _this.correct_players.length);
            player.points += guesser_award;
            notifySocket('success', "You've received " + guesser_award.toString() + " points!", "", player.id);
            //TODO: award points to the artist.. maybe based off the time when the guess happened (faster = more points)
            if (_this.correct_players.length == _this.players.length - 1) {
                //this.endRound();
                //? FIXME: cancel timer so that the rounds ends immediately when all users guessed correctly before the timer ran out 
                //this.timer.cancel(); 
                //clearTimeout(this.timer);
            }
        };
        this.startRound = function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this.status == "active")) return [3 /*break*/, 2];
                        this.clearBoards();
                        this.updateCurrentRound();
                        this.updateArtist();
                        this.updateWord();
                        this.correct_players = [];
                        this.updateClients();
                        console.log('Starting round: ' + this.current_round);
                        //setTimeout(this.endRound, this.round_length);
                        //this.timer = setTimeout(() => {console.log('???')}, this.round_length);
                        //await this.timer;
                        //console.log('after timer!!!!!!!!!!');
                        io["in"](this.room).emit('round started', this.round_length);
                        _a = this;
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, _this.round_length); })];
                    case 1:
                        _a.timer = _b.sent(); // sleep 
                        this.endRound();
                        _b.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); };
        this.status = "lobby";
        this.host = host;
        this.room = room;
        this.round_length = round_length * 1000;
        this.max_players = max_players;
        this.players = [];
        this.words = words;
        this.words_used = [];
        this.max_rounds = max_rounds;
        this.current_round = 0;
        this.lobby();
    }
    Game.prototype.endRound = function () {
        /*
            TODO:
            - give points to users
        */
        console.log('Round has ended');
        //FIXME:
        this.startRound();
    };
    Game.prototype.updateCurrentRound = function () {
        /*
            TODO:
            - if this.current_round + 1 > max_round, then end the game. else: increase the current_round by one
        */
        if ((this.current_round + 1) > this.max_rounds) {
            this.endGame();
        }
        else {
            this.current_round = this.current_round + 1;
        }
    };
    Game.prototype.updateWord = function () {
        /*
            TODO:
            - choose a random word from this.words
            - make sure it hasn't be chosen before (not in this.used_words)
        */
        this.current_word = this.words[Math.floor(Math.random() * this.words.length)];
        //this.current_word = "Test";
    };
    Game.prototype.updateArtist = function () {
        /*
            TODO:
            - only allow artist to be able to draw
            - artist no longer can type in chat
            - give only artist the current word
        */
        if (this.current_artist) {
            var currentArtistIndex = this.player_turns.indexOf(this.current_artist); // FIXME: make sure this works
            if (this.player_turns[currentArtistIndex + 1]) {
                this.current_artist = this.player_turns[currentArtistIndex + 1];
            }
            else {
                this.current_artist = this.player_turns[0];
            }
        }
        else {
            this.current_artist = this.player_turns[0];
        }
        notifySocket('info', "It's your turn to draw!", "", this.current_artist.id);
    };
    Game.prototype.endGame = function () {
        /*
            TODO:
            - show results
            - maybe redirect all users to Home
        */
        console.log('Game has ended');
        this.status = "ended";
        this.players.forEach(function (player) { return notifySocket('info', 'Game over!', 'The game has ended. Returning home.', player.id); });
        this.updateClients();
    };
    Game.prototype.clearBoards = function () {
        io["in"](this.room).emit('clear boards');
    };
    Game.prototype.updateClients = function () {
        io["in"](this.room).emit('game info', {
            current_artist: this.current_artist,
            current_round: this.current_round,
            host: this.host,
            max_players: this.max_players,
            max_rounds: this.max_rounds,
            player_turns: this.player_turns,
            players: this.players,
            room: this.room,
            round_length: this.round_length,
            status: this.status,
            correct_players: this.correct_players
        });
    };
    return Game;
}());
exports.Game = Game;
function SiteLogic(server) {
    io = require('socket.io')(server);
    var onlineUsers = [];
    /**
     * Finds game using room id
     * Joins user to the game room.
     * Updates the game's players with the new player (user)
     * @param user
     * @param game
     * @param socket
     */
    var joinGame = function (user, room, socket) {
        var game = findGame(room);
        console.log(game);
        console.log(games);
        console.log('Joining game ' + room);
        if (!game) {
            notifySocket('error', 'Unable to join game', "Game not found with id \"" + room + "\".", socket.id);
            return;
        }
        // Check if socket is already in the game. If it is, then update that player
        var playerFound;
        game.players.forEach(function (player, index) {
            if (player.id == socket.id) {
                playerFound == player;
                game.players[index] = user;
            }
        });
        // Add player if they are not already in the game
        if (!playerFound) {
            game.players.push(user);
        }
        socket.join(game.room);
        socket.emit('game joined', game);
        console.log(socket.id + " has joined room " + game.room);
    };
    /**
     * Creates a new Game (currently with preset settings)
     * Adds Game to the array games[]
     * @param user
     * @returns game
     */
    /* const createNewGame = (user: User): Game => {
        const roomId = Math.floor(Math.random() * 10000);
        const NEW_GAME = new Game(user, roomId.toString(), wordLists['misc'], 10);
        games.push(NEW_GAME);

        return NEW_GAME;
    } */
    var createGameSocket = function (socket) {
        socket.on('create game', function (obj) {
            var roomId = Math.floor(Math.random() * 50000);
            console.log(obj);
            var NEW_GAME = new Game(obj.user, roomId.toString(), wordLists['misc'], obj.max_rounds, obj.max_players, obj.round_length);
            games.push(NEW_GAME);
            joinGame(obj.user, NEW_GAME.room, socket);
            /* const NEW_GAME = createNewGame(obj.user);*/
        });
    };
    var joinGameSocket = function (socket) {
        socket.on('join game', function (obj) {
            joinGame(obj.user, obj.roomId, socket);
        });
    };
    var updateNicknameSocket = function (socket) {
        socket.on('send-nickname', function (nickname) {
            socket.nickname = nickname;
        });
    };
    var updateCanvasSocket = function (socket) {
        socket.on('updateCanvas', function (obj) {
            console.log(obj.room + " is being painted");
            if (obj) {
                socket.to(obj.room).emit('updateAllCanvases', {
                    data: obj.data
                });
            }
            /* io.emit('updateAllCanvases', {
            id: obj.id,
            data: obj.data
            }); */
        });
    };
    var getLobbyInfoSocket = function (socket) {
        socket.on('joined lobby', function (roomId) {
            var GAME_FOUND = findGame(roomId);
            if (GAME_FOUND) {
                if (GAME_FOUND.host.id !== socket.id) {
                    notifySocket('info', "[" + socket.nickname + "] has joined your lobby", '', GAME_FOUND.host.id);
                }
                io["in"](roomId).emit('game info', GAME_FOUND);
                //socket.emit('game info', lobby);
            }
        });
    };
    var startGameSocket = function (socket) {
        socket.on('start game', function (clientGameInfo) {
            if (socketInGame(socket, clientGameInfo)) {
                var realGame = findGame(clientGameInfo.room);
                if (socket.id === realGame.host.id) {
                    realGame.startGame();
                }
                else {
                    console.log(socket.id + " is not host");
                }
            }
            else {
                notifySocket('error', 'Unable to start game.', 'Please refresh and try again.', socket.id);
                //console.error(socket.id + ' is attempting to start a game they are not in (with ID ' + clientGameInfo.room + ')');
            }
        });
    };
    function findPlayerBySocketId(arr, socketId) {
        var playerFound = null;
        arr.forEach(function (player) {
            if (player.id == socketId) {
                playerFound = player;
            }
        });
        return playerFound;
    }
    var chatMessageSocket = function (socket) {
        socket.on('send message', function (obj) {
            // do not emit receive message if the word is correct 
            // Object.keys(socket.rooms)[0]
            // TODO: do not allow typing if user is in correct_players
            var realGame = findGame(obj.room);
            if (realGame) {
                if (realGame.current_artist && realGame.current_artist.id != socket.id) {
                    if (obj.message.toLowerCase() === realGame.current_word.toLowerCase()) {
                        if (realGame.status == "active") {
                            var correctPlayerFound = findPlayerBySocketId(realGame.correct_players, socket.id);
                            var playerFound = findPlayerBySocketId(realGame.players, socket.id);
                            if (playerFound) {
                                if (!correctPlayerFound) {
                                    io["in"](obj.room).emit('receive message', {
                                        message: socket.nickname + " guessed the word!",
                                        nickname: "[Game]"
                                    });
                                    //TODO: emit notification to user telling them how many points they received for guessing the word
                                    realGame.updateCorrectPlayers(playerFound);
                                }
                            }
                        }
                    }
                    else {
                        io["in"](obj.room).emit('receive message', {
                            message: obj.message,
                            nickname: socket.nickname
                        });
                    }
                }
                else {
                    io["in"](obj.room).emit('receive message', {
                        message: obj.message,
                        nickname: socket.nickname
                    });
                }
            }
        });
    };
    var handleDisconnect = function (socketId) {
        games.forEach(function (game) {
            game.players = game.players.filter(function (player) {
                if (player.id !== socketId) {
                    return true;
                }
                return false;
            });
            if (game.players.length < 2 && game.status == "active") {
                game.endGame();
            }
            io["in"](game.room).emit('game info', game);
        });
    };
    function socketInGame(socket, game) {
        //TODO: A much more efficient way of doing this is just loop through the socket's rooms and check if room id is in there
        var userFound = null;
        game.players.forEach(function (player) {
            if (player.id == socket.id)
                userFound = player;
        });
        return userFound;
    }
    function findGame(roomId) {
        var gameFound = null;
        games.forEach(function (game) {
            if (game.room === roomId)
                gameFound = game;
        });
        return gameFound;
    }
    function updateOnlineUsers(user) {
        var userFound = null;
        console.log(onlineUsers);
        onlineUsers.forEach(function (onlineUser, index) {
            if (typeof onlineUser != "undefined") {
                if (onlineUser.id === user.id) {
                    onlineUsers[index] = user;
                    userFound = true;
                    console.log('Updated user: ' + user.nickname);
                }
            }
            else {
                console.log('User iterated is undefined');
            }
        });
        if (!userFound)
            onlineUsers.push(user);
    }
    var requestWordSocket = function (socket) {
        socket.on('request word', function (game) {
            var realGame = findGame(game.room);
            if (realGame.current_artist) {
                if (realGame.current_artist.id == socket.id) {
                    socket.emit('get word', realGame.current_word);
                }
                else {
                    socket.emit('get word', null);
                }
            }
        });
    };
    io.on('connection', function (socket) {
        socket.score = 0;
        socket.emit('sendId', socket.id);
        socket.on('disconnect', function (_) { return handleDisconnect(socket.id); });
        joinGameSocket(socket);
        createGameSocket(socket);
        updateNicknameSocket(socket);
        console.log(socket.id + " has connected");
        updateCanvasSocket(socket);
        getLobbyInfoSocket(socket);
        startGameSocket(socket);
        chatMessageSocket(socket);
        requestWordSocket(socket);
    });
}
exports["default"] = SiteLogic;
module.exports.Game = SiteLogic;
