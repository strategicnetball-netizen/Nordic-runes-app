import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import { RUNES_VI, QUESTION_CONTEXTS_VI } from "./runesTranslations.js"

const app = express()
const PORT = process.env.PORT || 3003

app.use(cors({
  origin: "*",
  credentials: false
}))
app.use(bodyParser.json())
app.use(express.json())

// Nordic Runes Data - English version
const RUNES_EN = [
  { id: 1, name: "Fehu", symbol: "ᚠ", meaning: "Cattle, wealth, abundance", reversed: "Loss, poverty, greed", description: "Fehu represents material prosperity, wealth, and abundance. It is associated with fertility, increase, and the accumulation of resources. In readings, it often indicates financial gain, success, or the manifestation of abundance into your life.", reversed_description: "When Fehu appears reversed, financial loss or scarcity may be present. This rune warns of depleted resources, poverty mindset, or greed without wisdom. It calls you to examine your relationship with material security and find balance.", upright_guidance: "Wealth flowing in - Prosperity is present or approaching. Cattle/Livestock - Nurture your assets. Abundance - You have what you need.", reversed_guidance: "Loss of resources - Watch finances carefully. Poverty mindset - Scarcity thinking blocks flow. Greed - Desire without wisdom creates suffering." },
  { id: 2, name: "Uruz", symbol: "ᚢ", meaning: "Strength, wild ox, power", reversed: "Weakness, loss of control", description: "Uruz embodies raw strength, primal power, and vital energy. It represents physical prowess, courage, and the wild forces of nature. This rune often indicates a time of strength, determination, and the ability to overcome obstacles through sheer will.", reversed_description: "When Uruz appears reversed, strength is diminished and control may slip away. This rune suggests exhaustion, vulnerability, or loss of direction. It calls you to rest, recover, and rebuild your reserves before proceeding.", upright_guidance: "Strength available - Your power is at peak. Wild ox - Harness untamed energy. Courage - Act boldly now.", reversed_guidance: "Weakness emerging - Pace yourself. Loss of control - Regain center. Exhaustion - Rest is needed." },
  { id: 3, name: "Thurisaz", symbol: "ᚦ", meaning: "Thor, protection, challenge", reversed: "Danger, vulnerability", description: "Thurisaz is the rune of Thor, the thunder god, symbolizing protection, conflict, and challenge. It represents obstacles that must be confronted and overcome. This rune often appears when you face challenges that require strength and determination to surmount.", reversed_description: "When Thurisaz appears reversed, defenses are weakened and danger may be near. This rune warns of vulnerability, unresolved conflict, or threats to your safety. It urges caution and the need to strengthen your protective boundaries.", upright_guidance: "Thor's protection - Defense is strong. Challenge ahead - Growth through struggle. Conflict - Stand firm.", reversed_guidance: "Vulnerability exposed - Strengthen defenses. Danger present - Caution advised. Conflict unresolved - Seek peace." },
  { id: 4, name: "Ansuz", symbol: "ᚨ", meaning: "God, communication, wisdom", reversed: "Miscommunication, confusion", description: "Ansuz represents divine wisdom, communication, and the power of words. It is associated with Odin and the gift of knowledge. This rune often indicates clear communication, inspiration, messages, and the importance of listening to your inner wisdom.", reversed_description: "When Ansuz appears reversed, communication breaks down and confusion reigns. This rune suggests misunderstandings, hidden messages, or loss of clarity. It calls you to seek clarification and listen more carefully before acting.", upright_guidance: "Communication clear - Speak your truth. Wisdom flowing - Trust insight. Messages arriving - Listen carefully.", reversed_guidance: "Miscommunication - Clarify intent. Confusion reigns - Seek understanding. Silence - Speak up." },
  { id: 5, name: "Raido", symbol: "ᚱ", meaning: "Journey, travel, wheel", reversed: "Delay, recklessness", description: "Raido symbolizes journeys, both physical and spiritual. It represents movement, cycles, and the journey of life. This rune often indicates travel, transitions, or the need to shift your perspective to move forward.", reversed_description: "When Raido appears reversed, movement is blocked or delayed. This rune warns of obstacles on your path, poor timing, or reckless action without proper planning. It calls you to pause, reassess your direction, and wait for the right moment.", upright_guidance: "Journey begins - Movement is favorable. Travel - Safe passage ahead. Cycle turning - Progress unfolds.", reversed_guidance: "Delays inevitable - Patience required. Recklessness - Slow down. Journey blocked - Reassess direction." },
  { id: 6, name: "Kenaz", symbol: "ᚲ", meaning: "Torch, light, knowledge", reversed: "Ignorance, darkness", description: "Kenaz is the rune of illumination, representing light, knowledge, and understanding. It symbolizes clarity, insight, and the revealing of hidden truths. This rune often indicates that answers are becoming clear or that understanding will soon arrive.", reversed_description: "When Kenaz appears reversed, darkness obscures the truth and confusion prevails. This rune warns of hidden knowledge, concealed information, or ignorance of important facts. It calls you to seek answers and illuminate what has been hidden.", upright_guidance: "Torch lit - Clarity coming. Light reveals - Truth emerges. Knowledge - Understanding grows.", reversed_guidance: "Darkness - Confusion reigns. Ignorance - Seek answers. Obscured - Truth hidden." },
  { id: 7, name: "Gebo", symbol: "ᚳ", meaning: "Gift, partnership, balance", reversed: "Debt, imbalance", description: "Gebo represents gifts, exchanges, and partnerships. It symbolizes balance, reciprocity, and the connection between all things. This rune often indicates harmonious relationships, fair exchanges, or the need to maintain balance in your life.", reversed_description: "When Gebo appears reversed, balance is lost and debts accrue. This rune warns of imbalanced relationships, obligations that weigh heavily, or unfair exchanges. It calls you to restore equilibrium and address what is unresolved.", upright_guidance: "Gift received - Generosity flows. Partnership - Balance honored. Exchange - Fair trade.", reversed_guidance: "Debt owed - Obligation weighs. Imbalance - Restore equilibrium. Conflict - Reconcile." },
  { id: 8, name: "Wunjo", symbol: "ᚹ", meaning: "Joy, harmony, light", reversed: "Sorrow, discord", description: "Wunjo embodies joy, happiness, and harmony. It represents contentment, light, and the fulfillment of desires. This rune often indicates positive outcomes, happiness, and the attainment of goals that bring genuine satisfaction.", reversed_description: "When Wunjo appears reversed, joy fades and discord replaces harmony. This rune suggests sorrow, conflict, or the loss of something cherished. It calls you to seek support and work through grief before the light returns.", upright_guidance: "Joy abounds - Celebrate. Harmony - Peace prevails. Light - Brightness returns.", reversed_guidance: "Sorrow present - Grief acknowledged. Discord - Conflict healing. Sadness - Seek support." },
  { id: 9, name: "Hagalaz", symbol: "ᚼ", meaning: "Hail, disruption, transformation", reversed: "Chaos, destruction", description: "Hagalaz represents hail, sudden disruption, and transformative forces. It symbolizes challenges that initiate change and growth. This rune often indicates upheaval, but ultimately transformation and renewal that leads to positive outcomes.", reversed_description: "When Hagalaz appears reversed, destructive chaos threatens stability. This rune warns of loss of control, severe disruption, or forces beyond your command. It calls you to find shelter, stabilize your situation, and protect what matters most.", upright_guidance: "Hail falls - Disruption brings change. Transformation - Rebirth coming. Challenge - Growth through struggle.", reversed_guidance: "Chaos reigns - Find stability. Destruction - Prevent further loss. Storm - Seek shelter." },
  { id: 10, name: "Nauthiz", symbol: "ᚾ", meaning: "Need, necessity, friction", reversed: "Constraint, hardship", description: "Nauthiz represents need, constraint, and the friction that motivates change. It symbolizes hardship that teaches valuable lessons. This rune often indicates limitations that actually serve to strengthen your character and determination.", reversed_description: "When Nauthiz appears reversed, hardship deepens and constraints feel inescapable. This rune warns of serious limitations, suffering without growth, or being trapped. It calls you to seek help, reassess your situation, and find a way forward.", upright_guidance: "Need felt - Motivation builds. Friction - Pressure creates change. Necessity - Essential growth.", reversed_guidance: "Constraint felt - Limitations real. Hardship - Persevere. Struggle - Seek help." },
  { id: 11, name: "Isa", symbol: "ᚣ", meaning: "Ice, stillness, pause", reversed: "Stagnation, frozen situations", description: "Isa represents ice, stillness, and pause. It symbolizes a period of waiting, reflection, and the clarification that comes through stillness. This rune often indicates a time to hold steady, reflect on your situation, and maintain your focus.", reversed_description: "When Isa appears reversed, stagnation has set in and progress freezes. This rune warns of being stuck, unable to move forward, or lifeless stagnation. It calls you to break the ice, initiate movement, and thaw what has been frozen.", upright_guidance: "Ice holds firm - Pause needed. Stillness - Clarity emerges. Reflection - Understand deeply.", reversed_guidance: "Stagnation - Movement blocked. Frozen - Thaw needed. Stillness - Becomes lifeless." },
  { id: 12, name: "Jera", symbol: "ᚤ", meaning: "Year, harvest, cycle", reversed: "Delays, broken cycle", description: "Jera symbolizes the cycle of seasons, harvest, and natural rhythm. It represents completion, reward for effort, and the turning of the year. This rune often indicates successful completion of cycles, harvest of what you've sown, and natural progression.", reversed_description: "When Jera appears reversed, the cycle breaks and harvest is delayed. This rune warns that efforts may not yield results as expected, or natural progression is interrupted. It calls you to be patient, trust the timing, and continue your work.", upright_guidance: "Harvest arrives - Results manifest. Cycle complete - New begins. Reward earned - Celebration.", reversed_guidance: "Delays - Patience needed. Cycle broken - Restart. Harvest withheld - Keep trying." },
  { id: 13, name: "Eihwaz", symbol: "ᚥ", meaning: "Yew, protection, death/rebirth", reversed: "Unreliability, stagnation", description: "Eihwaz is the rune of the yew tree, representing protection, transformation, and the cycle of death and rebirth. It symbolizes resilience and the ability to adapt. This rune often indicates protective influences or a time of personal transformation and renewal.", reversed_description: "When Eihwaz appears reversed, protection fails and renewal is blocked. This rune warns of unreliable support, stagnation instead of transformation, or inability to adapt. It calls you to rebuild defenses and seek new sources of stability.", upright_guidance: "Yew strong - Protection solid. Death/rebirth - Transformation sacred. Resilience - Adapt and thrive.", reversed_guidance: "Unreliability - Trust broken. Stagnation - Renewal blocked. Protection fails - Rebuild defenses." },
  { id: 14, name: "Perthro", symbol: "ᚦ", meaning: "Fate, mystery, initiation", reversed: "Misfortune, deception", description: "Perthro represents fate, mystery, and initiation. It symbolizes the unknown, hidden knowledge, and life's secrets. This rune often indicates that mysteries are being revealed, initiation into new knowledge, or the need to embrace the unknown.", reversed_description: "When Perthro appears reversed, deception obscures truth and misfortune looms. This rune warns of hidden dangers, false information, or fate working against you. It calls you to remain vigilant, trust your intuition, and seek clarity.", upright_guidance: "Mystery reveals - Secrets emerge. Initiation - New knowledge begins. Fate - Destiny unfolds.", reversed_guidance: "Misfortune - Bad luck apparent. Deception - Truth hidden. Mystery - Remains obscure." },
  { id: 15, name: "Algiz", symbol: "ᚨ", meaning: "Protection, defense, shield", reversed: "Vulnerability, danger", description: "Algiz represents protection, defense, and the raised shield of the warrior. It symbolizes safety, protection, and higher consciousness. This rune often indicates that you are protected, that spiritual forces are guiding you, or that protection is available to you.", reversed_description: "When Algiz appears reversed, your protective shields weaken and vulnerability increases. This rune warns of exposure to danger, weakened defenses, or loss of spiritual protection. It calls you to strengthen your boundaries and seek safety.", upright_guidance: "Shield raised - Protection strong. Defense ready - Safety assured. Higher power - Guides you.", reversed_guidance: "Vulnerability - Guard down. Danger - Stay alert. Unprotected - Strengthen boundaries." },
  { id: 16, name: "Sowilo", symbol: "ᚳ", meaning: "Sun, success, wholeness", reversed: "Failure, lack of energy", description: "Sowilo is the rune of the sun, representing success, wholeness, and clarity. It symbolizes vitality, energy, and the triumph of light over darkness. This rune often indicates success, achievement, and a period of clarity and positive momentum.", reversed_description: "When Sowilo appears reversed, darkness obscures your path and energy fades. This rune warns of failure, exhaustion, or the dimming of hope. It calls you to rest, rebuild your strength, and wait for the light to return.", upright_guidance: "Sun shines - Success evident. Wholeness - Integration complete. Energy - Vitality flows.", reversed_guidance: "Failure - Effort stalled. Energy low - Exhaustion real. Darkness - Light dimmed." },
  { id: 17, name: "Tiwaz", symbol: "ᛏ", meaning: "Tyr, courage, victory", reversed: "Defeat, cowardice", description: "Tiwaz is the rune of Tyr, the warrior god, representing courage, victory, and masculine power. It symbolizes honor, justice, and the warrior spirit. This rune often indicates triumph, the need to stand firm in your convictions, or the approach of victory.", reversed_description: "When Tiwaz appears reversed, courage falters and defeat approaches. This rune warns of loss, injustice, or the need to retreat and reassess. It calls you to honor your limits and seek a new strategy.", upright_guidance: "Courage rises - Act boldly. Victory near - Triumph coming. Honor - Stand tall.", reversed_guidance: "Defeat looms - Accept loss. Cowardice - Fear dominates. Justice - Denied." },
  { id: 18, name: "Berkano", symbol: "ᛒ", meaning: "Birch, growth, fertility", reversed: "Stagnation, infertility", description: "Berkano represents the birch tree, symbolizing growth, fertility, and new beginnings. It represents nurturing, motherhood, and the feminine principle. This rune often indicates growth, new projects taking root, or a period of fertility and abundance.", reversed_description: "When Berkano appears reversed, growth halts and fertility diminishes. This rune warns of barrenness, obstacles blocking progress, or projects stalled. It calls you to remove barriers and nurture what is blocked.", upright_guidance: "Birch grows - New begins. Fertility - Abundance flows. Growth - Nurture it.", reversed_guidance: "Stagnation - Growth halted. Infertility - Barrenness felt. Blocked - Remove obstacles." },
  { id: 19, name: "Ehwaz", symbol: "ᛖ", meaning: "Horse, movement, partnership", reversed: "Stagnation, conflict", description: "Ehwaz represents the horse, symbolizing movement, partnership, and harmony. It represents loyal companionship and synchronized action. This rune often indicates partnerships, smooth progress, or the need to move forward with trusted allies.", reversed_description: "When Ehwaz appears reversed, movement stalls and partnerships strain. This rune warns of conflict in relationships, inability to progress together, or loss of synchronization. It calls you to address discord and rebuild trust.", upright_guidance: "Horse moves - Progress flows. Partnership - Harmony aligned. Loyalty - Trust honored.", reversed_guidance: "Stagnation - Progress blocked. Conflict - Partnership strained. Movement - Halted." },
  { id: 20, name: "Mannaz", symbol: "ᛘ", meaning: "Man, self, human condition", reversed: "Selfishness, weakness", description: "Mannaz represents humanity, the self, and interdependence. It symbolizes reason, intellect, and human potential. This rune often indicates self-awareness, the importance of community, or reflection on your place in society.", reversed_description: "When Mannaz appears reversed, ego dominates and isolation increases. This rune warns of selfishness, fragmentation from community, or inner weakness. It calls you to reconnect with others and examine your ego.", upright_guidance: "Self aware - Know thyself. Community - Connection honored. Potential - Manifest it.", reversed_guidance: "Selfishness - Ego dominant. Weakness - Fragility revealed. Isolation - Reconnect." },
  { id: 21, name: "Laguz", symbol: "ᛚ", meaning: "Water, flow, emotions", reversed: "Stagnation, emotional turmoil", description: "Laguz represents water, emotions, and the flow of life. It symbolizes intuition, healing, and the unconscious mind. This rune often indicates the need to trust your intuition, emotional healing, or allowing life to flow naturally.", reversed_description: "When Laguz appears reversed, emotional currents become turbulent and intuition fails. This rune warns of inner turmoil, blocked intuition, or stagnation in your emotional flow. It calls you to seek clarity and let emotions settle.", upright_guidance: "Water flows - Emotions clear. Intuition - Trust it. Healing - Begins naturally.", reversed_guidance: "Stagnation - Flow blocked. Turmoil - Emotions chaotic. Intuition - Confused." },
  { id: 22, name: "Ingwaz", symbol: "ᛝ", meaning: "Ing, fertility, new beginning", reversed: "Stagnation, lack of progress", description: "Ingwaz is the rune of the god Ing, representing fertility, completion, and new beginnings. It symbolizes the seeds of potential and transformation. This rune often indicates that projects are reaching completion or new ventures are about to begin.", reversed_description: "When Ingwaz appears reversed, projects stall and new beginnings are delayed. This rune warns of incompletion, infertility of ideas, or inability to move forward. It calls you to remove blockages and find what will restart your momentum.", upright_guidance: "Fertility - New life. Completion - Closure near. Beginning - Fresh start.", reversed_guidance: "Stagnation - Progress stuck. Infertility - Barren feeling. Incompletion - Unfinished." },
  { id: 23, name: "Othala", symbol: "ᛟ", meaning: "Inheritance, home, property", reversed: "Loss, displacement", description: "Othala represents inheritance, home, and ancestral property. It symbolizes security, family, and one's place in the world. This rune often indicates stability, family connections, or the manifestation of a sense of belonging and security.", reversed_description: "When Othala appears reversed, stability crumbles and displacement threatens. This rune warns of loss of home, family discord, or loss of security. It calls you to seek refuge and rebuild your foundations.", upright_guidance: "Home secure - Foundation solid. Inheritance - Legacy honored. Belonging - You have roots.", reversed_guidance: "Loss coming - Insecurity felt. Displacement - Uprooted. Homeless - Seeking place." },
  { id: 24, name: "Dagaz", symbol: "ᛞ", meaning: "Day, breakthrough, clarity", reversed: "Confusion, stagnation", description: "Dagaz represents the day and breakthrough. It symbolizes clarity, breakthrough, and the triumph of light. This rune often indicates sudden clarity, a breakthrough in understanding, or the emergence of a new day bringing positive change.", reversed_description: "When Dagaz appears reversed, breakthrough is delayed and confusion persists. This rune warns of continued darkness, inability to see clearly, or persistent stagnation. It calls you to have patience as you await the light to return.", upright_guidance: "Breakthrough - Clarity arrives. Day dawns - New light. Transformation - Sudden shift.", reversed_guidance: "Confusion - Clarity eludes. Stagnation - Breakthrough delayed. Darkness - Persists." }
]

// Question contexts
const QUESTION_CONTEXTS = {
  love: {
    title: "Love & Relationships",
    interpretation: "This reading explores matters of the heart, romance, and personal relationships."
  },
  career: {
    title: "Career & Work",
    interpretation: "This reading provides insight into your professional path and work situation."
  },
  health: {
    title: "Health & Wellness",
    interpretation: "This reading addresses your physical and mental well-being."
  },
  finance: {
    title: "Finance & Wealth",
    interpretation: "This reading explores your financial situation and material prosperity."
  },
  personal: {
    title: "Personal Growth",
    interpretation: "This reading focuses on self-development and personal transformation."
  },
  general: {
    title: "General Guidance",
    interpretation: "This reading provides general insight and guidance for your current situation."
  }
}

// Health endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Nordic Runes backend is running" })
})

// Helper function to get runes by language
function getRunesByLanguage(lang = 'en') {
  return lang === 'vi' ? RUNES_VI : RUNES_EN
}

// Helper function to get contexts by language
function getContextsByLanguage(lang = 'en') {
  return lang === 'vi' ? QUESTION_CONTEXTS_VI : QUESTION_CONTEXTS
}

// Get all runes
app.get("/api/runes", (req, res) => {
  const lang = req.query.lang || 'en'
  const runes = getRunesByLanguage(lang)
  res.json(runes)
})

// Get single rune by ID
app.get("/api/runes/:id", (req, res) => {
  const lang = req.query.lang || 'en'
  const runes = getRunesByLanguage(lang)
  const rune = runes.find(r => r.id === parseInt(req.params.id))
  if (!rune) return res.status(404).json({ error: "Rune not found" })
  res.json(rune)
})

// Get question contexts
app.get("/api/contexts", (req, res) => {
  const lang = req.query.lang || 'en'
  const contexts = getContextsByLanguage(lang)
  res.json(contexts)
})

// Generate comprehensive rune interpretation
function generateRuneInterpretation(stones, contextData, contextKey, customQuestion, lang = 'en') {
  let reading = ""

  if (stones.length === 1) {
    const stone = stones[0]
    const meaning = stone.interpretation
    const yourQuestion = lang === 'vi' ? "Câu hỏi của bạn" : "Your Question"
    const theMessage = lang === 'vi' ? "Thông điệp" : "The Message"
    const guidance = lang === 'vi' ? "Hướng dẫn để tiến lên phía trước" : "Guidance to Move Forward"
    
    reading = `
## ${lang === 'vi' ? "Bài Đọc Một Rune Của Bạn" : "Your Single Rune Reading"}

**${lang === 'vi' ? "Rune" : "The Rune"}: ${stone.name} (${stone.symbol})**
${stones[0].reversed ? "*(Reversed)*" : "*(Upright)*"}

**${yourQuestion}:** "${customQuestion || (lang === 'vi' ? 'Câu hỏi của bạn' : 'Your inquiry')}"

**${theMessage}:** ${meaning}

**${guidance}:**
${generateGuidance(stone, contextKey, customQuestion, stones[0].reversed, lang)}
    `.trim()
  } else if (stones.length === 2) {
    const current = stones[0]
    const outcome = stones[1]
    const position1 = lang === 'vi' ? "Vị trí 1 - Tình huống Hiện tại" : "Position 1 - Current Situation"
    const position2 = lang === 'vi' ? "Vị trí 2 - Kết quả Tiềm năng" : "Position 2 - Potential Outcome"
    const twoRuneTitle = lang === 'vi' ? "Bài Đọc Hai Rune Của Bạn" : "Your Two Rune Reading"
    const relationship = lang === 'vi' ? "Mối Quan hệ Giữa Các Rune Này" : "The Relationship Between These Runes"
    const pathForward = lang === 'vi' ? "Con đường Phía trước Của Bạn" : "Your Path Forward"
    const overallMessage = lang === 'vi' ? "Thông điệp Tổng thể" : "Overall Message"
    
    reading = `
## ${twoRuneTitle}

**${position1}: ${current.name} (${current.symbol})**
${current.reversed ? "*(Reversed)*" : "*(Upright)*"}

${generateRuneDetail(current, "current", contextKey, lang)}

**${position2}: ${outcome.name} (${outcome.symbol})**
${outcome.reversed ? "*(Reversed)*" : "*(Upright)*"}

${generateRuneDetail(outcome, "outcome", contextKey, lang)}

**${relationship}:**

${generateCombinationInsight([current, outcome], contextKey, customQuestion, lang)}

**${pathForward}:**

${generateTwoRuneAdvice([current, outcome], contextKey, customQuestion, lang)}

**${overallMessage}:**

${generateOverallMessage([current, outcome], contextKey, customQuestion, lang)}
    `.trim()
  } else {
    const past = stones[0]
    const present = stones[1]
    const future = stones[2]
    const threeRuneTitle = lang === 'vi' ? "Bài Đọc Ba Rune Của Bạn" : "Your Three Rune Reading"
    const position1 = lang === 'vi' ? "Vị trí 1 - Ảnh hưởng Quá khứ" : "Position 1 - Past Influence"
    const position2 = lang === 'vi' ? "Vị trí 2 - Tình huống Hiện tại" : "Position 2 - Present Situation"
    const position3 = lang === 'vi' ? "Vị trí 3 - Hướng dẫn Tương lai" : "Position 3 - Future Guidance"
    const connected = lang === 'vi' ? "Cách Các Rune Này Kết Nối" : "How These Three Runes Connect"
    const journeyRevealed = lang === 'vi' ? "Hành Trình Của Bạn Được Tiết Lộ" : "Your Journey Revealed"
    const completePicture = lang === 'vi' ? "Bức Tranh Hoàn Chỉnh" : "The Complete Picture"
    
    reading = `
## ${threeRuneTitle}

**${position1}: ${past.name} (${past.symbol})**
${past.reversed ? "*(Reversed)*" : "*(Upright)*"}

${generateRuneDetail(past, "past", contextKey, lang)}

**${position2}: ${present.name} (${present.symbol})**
${present.reversed ? "*(Reversed)*" : "*(Upright)*"}

${generateRuneDetail(present, "present", contextKey, lang)}

**${position3}: ${future.name} (${future.symbol})**
${future.reversed ? "*(Reversed)*" : "*(Upright)*"}

${generateRuneDetail(future, "future", contextKey, lang)}

**${connected}:**

${generateThreeRuneFlow([past, present, future], contextKey, customQuestion, lang)}

**${journeyRevealed}:**

${generateThreeRuneAdvice([past, present, future], contextKey, customQuestion, lang)}

**${completePicture}:**

${generateCompleteNarrative([past, present, future], contextKey, customQuestion, lang)}
    `.trim()
  }

  return reading
}

function generateSingleRuneInsight(stone, context, customQuestion, isReversed) {
  if (customQuestion && customQuestion.trim()) {
    // Provide specific insight based on the question and rune state
    const reversedNote = isReversed ? " in its reversed form" : ""
    const guidanceList = isReversed 
      ? (stone.reversed_guidance || stone.reversedMeaning).split('. ').slice(0, 2).join('. ')
      : (stone.upright_guidance || stone.meaning).split('. ').slice(0, 2).join('. ')
    
    const meaningText = isReversed ? (stone.reversedMeaning || stone.reversed) : stone.meaning
    return `${stone.name}${reversedNote} speaks directly to your question about "${customQuestion}". ${isReversed ? `The reversed energy suggests: ${meaningText}` : `This rune indicates: ${meaningText}`}. Key aspects: ${guidanceList}.`
  }
  
  const contextInsights = {
    love: `This rune speaks directly to your romantic situation. ${stone.meaning} suggests deep truths about connection and intimacy.`,
    career: `In your professional life, this rune indicates ${stone.meaning}. Pay attention to how this energy manifests in your work.`,
    health: `Regarding your well-being, this rune advises focus on ${stone.meaning}. Consider both physical and emotional aspects.`,
    finance: `Your financial path is illuminated by ${stone.meaning}. This suggests ${isReversed ? "caution and reassessment" : "opportunity and growth"}.`,
    personal: `In your personal growth, this rune emphasizes ${stone.meaning}. This is a key area for your development.`,
    general: `The universe draws your attention to ${stone.meaning}. This wisdom applies to your current situation.`,
    custom: `Regarding your question, this rune indicates: ${stone.meaning}`
  }
  return contextInsights[context] || contextInsights.general
}

function generateGuidance(stone, context, customQuestion, isReversed, lang = 'en') {
  if (customQuestion && customQuestion.trim()) {
    if (isReversed) {
      return lang === 'vi' 
        ? "Hãy chậm lại và kiểm tra những gì ở bề mặt dưới. Sự khôn ngoan nằm trong việc hiểu các chướng ngại trước khi tiếp tục."
        : "Slow down and examine what's beneath the surface. The wisdom lies in understanding the obstacles before proceeding."
    } else {
      return lang === 'vi'
        ? "Rune này hỗ trợ chuyển động tiến lên. Tin tưởng năng lượng của nó và thực hiện hành động phù hợp khi bạn cảm thấy sẵn sàng."
        : "This rune is supportive of movement forward. Trust its energy and take aligned action when you feel ready."
    }
  }
  
  if (isReversed) {
    return lang === 'vi'
      ? "Làm việc với những thách thức của rune này như những người dạy. Hiểu những gì cần chú ý và bạn sẽ tìm thấy con đường phía trước."
      : "Work with this rune's challenges as teachers. Understand what needs attention, and you'll find the path forward."
  }
  
  return lang === 'vi'
    ? "Hãy tìm kiếm năng lượng hỗ trợ của rune này khi bạn điều hướng tình huống của bạn."
    : "Lean into this rune's supportive energy as you navigate your situation."
}

function generateContextualAdvice(stone, context, customQuestion, isReversed) {
  if (customQuestion && customQuestion.trim()) {
    if (isReversed) {
      return `This reversed rune suggests caution. Pause to address the obstacles revealed: ${stone.reversedMeaning}. Consider what needs to change or be reconsidered first.`
    } else {
      return `This rune indicates ${stone.meaning}. The energy supports moving forward, though remain mindful of the nuances this rune brings.`
    }
  }
  
  if (context === "love") {
    return isReversed 
      ? `There may be tension or obstacles in this matter. Take time to reflect before acting.`
      : `The energy is favorable. Trust your heart and move forward with openness.`
  } else if (context === "career") {
    return isReversed
      ? `You may face challenges. Stay focused and adaptable as you navigate this situation.`
      : `Professional opportunities are aligned in your favor. Proceed with confidence.`
  }
  return "Consider how this rune's energy applies to your specific situation."
}

function generateRuneDetail(stone, position, context, lang = 'en') {
  const positionDescriptions = {
    current: lang === 'vi' ? "Điều này đại diện cho những gì đang xảy ra ngay bây giờ trong tình huống của bạn." : "This represents what is happening right now in your situation.",
    outcome: lang === 'vi' ? "Điều này cho thấy mọi thứ đang hướng tới hoặc những gì có thể xuất hiện." : "This shows where things are moving or what will likely manifest.",
    past: lang === 'vi' ? "Điều này cho thấy nền tảng và ảnh hưởng đã đưa bạn đến đây." : "This shows the foundation and influences that brought you here.",
    present: lang === 'vi' ? "Điều này đại diện cho các năng lượng và lực lượng đang tác động lên bạn." : "This represents the energies and forces acting upon you now.",
    future: lang === 'vi' ? "Điều này tiết lộ hướng của sự triển khai và sự khôn ngoan được cần thiết." : "This reveals the direction of unfoldment and the wisdom needed."
  }

  let detail = `\n${positionDescriptions[position]} `
  const reversedMeaningText = stone.reversed ? (stone.reversedMeaning || stone.meaning) : stone.meaning
  const energy = lang === 'vi' ? "Năng lượng" : "Energy"
  detail += `**${stone.reversed ? (lang === 'vi' ? "Đảo ngược" : "Reversed") : (lang === 'vi' ? "Thẳng đứng" : "Upright")} ${energy}:** ${reversedMeaningText} `
  
  if (stone.reversed) {
    detail += lang === 'vi'
      ? "Rune này xuất hiện đảo ngược, gợi ý các thách thức, bài học ẩn giấu hoặc nhu cầu tích hợp các khía cạnh bóng tối của nó."
      : "This rune appears reversed, suggesting challenges, hidden lessons, or the need to integrate its shadow aspects."
  } else {
    detail += lang === 'vi'
      ? "Rune này xuất hiện thẳng đứng, mang lại toàn bộ tiềm năng tích cực cho tình huống của bạn."
      : "This rune appears upright, bringing its full positive potential to your situation."
  }

  return detail
}

function generateCombinationInsight(stones, context, customQuestion, lang = 'en') {
  const stone1 = stones[0]
  const stone2 = stones[1]
  
  const isPositive = !stone1.reversed && !stone2.reversed
  const hasChallenge = stone1.reversed || stone2.reversed
  
  let insight = `\n`
  
  if (isPositive) {
    if (lang === 'vi') {
      insight += `Cả hai rune đều xuất hiện thẳng đứng, gợi ý một dòng chảy hài hòa. ${stone1.name} hỗ trợ sự xuất hiện của ${stone2.name}, chỉ ra các năng lượng được sắp xếp hướng tới giải quyết tích cực.`
    } else {
      insight += `Both runes appear upright, suggesting a harmonious flow. ${stone1.name} supports the emergence of ${stone2.name}, indicating aligned energies moving toward positive resolution.`
    }
  } else if (hasChallenge) {
    if (lang === 'vi') {
      insight += `Một hoặc nhiều rune xuất hiện đảo ngược, gợi ý sự căng thẳng hoặc chuyển đổi. Điều này chỉ ra sự tăng trưởng đòi hỏi nỗ lực—${stone1.name} và ${stone2.name} cùng nhau tiết lộ những gì cần thay đổi.`
    } else {
      insight += `One or more runes appear reversed, suggesting tension or transformation. This indicates growth requiring effort—${stone1.name} and ${stone2.name} together reveal what needs to shift.`
    }
  }
  
  if (lang === 'vi') {
    insight += ` Cùng nhau, các rune này gợi ý: ${combineRuneMeanings(stone1, stone2, lang)}`
  } else {
    insight += ` Together, these runes suggest: ${combineRuneMeanings(stone1, stone2, lang)}`
  }
  
  return insight
}

function generateTwoRuneAdvice(stones, context, customQuestion, lang = 'en') {
  const current = stones[0]
  const outcome = stones[1]
  
  let advice = "\n"
  
  if (customQuestion && customQuestion.trim()) {
    const regardingText = lang === 'vi' ? "Về câu hỏi của bạn" : "Regarding your question"
    advice += `${regardingText} "${customQuestion}": `
  }
  
  const currentRuneText = lang === 'vi' ? "Rune hiện tại" : "The current rune"
  const outcomeText = lang === 'vi' ? "rune kết quả" : "rune"
  const showsText = lang === 'vi' ? "cho thấy nơi bạn đứng, trong khi" : "shows where you stand, while"
  const revealsText = lang === 'vi' ? "tiết lộ hướng của chuyển động" : "reveals the direction of movement"
  
  advice += `${currentRuneText} (${current.name}) ${showsText} ${outcomeText} (${outcome.name}) ${revealsText}. `
  
  if (current.reversed && !outcome.reversed) {
    if (lang === 'vi') {
      advice += `Bạn đang chuyển từ thách thức sang giải quyết. Các chướng ngại bạn phải đối mặt bây giờ đang xóa—tin tưởng quá trình và tiếp tục tiến lên.`
    } else {
      advice += `You're moving from challenge toward resolution. The obstacles you face now are clearing—trust the process and continue moving forward.`
    }
  } else if (!current.reversed && outcome.reversed) {
    if (lang === 'vi') {
      advice += `Hãy cẩn thận. Những gì xuất hiện thuận lợi bây giờ có thể đòi hỏi xem xét lại hoặc điều chỉnh. Tiến hành suy tư.`
    } else {
      advice += `Be cautious. What appears favorable now may require reconsideration or adjustment. Proceed thoughtfully.`
    }
  } else if (current.reversed && outcome.reversed) {
    if (lang === 'vi') {
      advice += `Sự chuyển đổi đáng kể đang diễn ra. Cả hai vị trí gợi ý sự thay đổi sâu sắc—điều này thách thức bạn thay đổi cơ bản cách tiếp cận của bạn.`
    } else {
      advice += `Significant transformation is at work. Both positions suggest deep change—this challenges you to fundamentally shift your approach.`
    }
  } else {
    if (lang === 'vi') {
      advice += `Dòng chảy hài hòa từ hiện tại đến kết quả là thuận lợi. Con đường phía trước của bạn là rõ ràng và được hỗ trợ.`
    } else {
      advice += `The harmonious flow from current to outcome is favorable. Your path forward is clear and supported.`
    }
  }
  
  return advice
}

function generateThreeRuneFlow(stones, context, customQuestion, lang = 'en') {
  const past = stones[0]
  const present = stones[1]
  const future = stones[2]
  
  let flow = `\n`
  
  if (customQuestion && customQuestion.trim()) {
    const regardingText = lang === 'vi' ? "Về" : "Regarding"
    const suggestText = lang === 'vi' ? "Điều này đại diện cho câu chuyện của bạn" : "This represents your unfolding story"
    flow += `${regardingText} "${customQuestion}": ${past.name} đã mang bạn đến thời điểm này với ${present.name}, và bây giờ bạn được mời vào ${future.name}. ${suggestText} liên quan đến câu hỏi của bạn. `
  } else {
    const suggestText = lang === 'vi' ? "Điều này đại diện cho câu chuyện của bạn" : "This represents your unfolding story"
    flow += `${past.name} đã mang bạn đến thời điểm này với ${present.name}, và bây giờ bạn được mời vào ${future.name}. ${suggestText}. `
  }
  
  const pastText = lang === 'vi' 
    ? (past.reversed ? "Những thách thức quá khứ" : "Sức mạnh quá khứ")
    : (past.reversed ? "Past challenges" : "Past strengths")
  const presentText = lang === 'vi'
    ? (present.reversed ? "những chướng ngại hiện tại" : "những cơ hội hiện tại")
    : (present.reversed ? "current obstacles" : "present opportunities")
  const futureText = lang === 'vi'
    ? (future.reversed ? "sự tăng trưởng tương lai đến thông qua tích hợp" : "tương lai triển khai với sự rõ ràng")
    : (future.reversed ? "future growth comes through integration" : "the future unfolds with clarity")

  flow += `${pastText} đã định hình bạn; ${presentText} thử nghiệm và phát triển bạn; và ${futureText}.`
  
  return flow
}

function generateThreeRuneAdvice(stones, context, customQuestion, lang = 'en') {
  const past = stones[0]
  const present = stones[1]
  const future = stones[2]
  
  let advice = `\n`
  
  const reversedCount = [past.reversed, present.reversed, future.reversed].filter(r => r).length
  
  if (customQuestion && customQuestion.trim()) {
    if (reversedCount === 0) {
      if (lang === 'vi') {
        advice += `Cả ba rune đều xuất hiện thẳng đứng—một dấu hiệu thuận lợi về câu hỏi của bạn. Bạn có động lực và sự rõ ràng. Sự khôn ngoan quá khứ của bạn về "${customQuestion}", sự rõ ràng hiện tại của bạn và tiềm năng tương lai của bạn đều được sắp xếp hàng. Tiến lên với sự tự tin.`
      } else {
        advice += `All three runes appear upright—a favorable sign regarding your question. You have momentum and clarity. Your past wisdom about "${customQuestion}", your present clarity, and your future potential are all aligned. Move forward with confidence.`
      }
    } else if (reversedCount === 1) {
      if (lang === 'vi') {
        advice += `Một rune xuất hiện đảo ngược, gợi ý một thách thức cụ thể để điều hướng về câu hỏi của bạn. Giải quyết điều này một cách có ý thức trong khi tận dụng năng lượng tích cực của hai rune khác.`
      } else {
        advice += `One rune appears reversed, suggesting a specific challenge to navigate regarding your question about "${customQuestion}". Address this consciously while leveraging the positive energy of the other two runes.`
      }
    } else if (reversedCount === 2) {
      if (lang === 'vi') {
        advice += `Hai rune đảo ngược chỉ ra sự chuyển đổi đáng kể trong cách câu hỏi của bạn sẽ triển khai. Bạn được yêu cầu từ bỏ các mẫu cũ về vấn đề này và chấp nhận sự thay đổi sâu sắc. Rune thẳng đứng cung cấp hướng dẫn thông qua sự chuyển đổi này.`
      } else {
        advice += `Two runes reversed indicate significant transition in how your question will unfold. You're being asked to release old patterns about this matter and embrace deep change. The upright rune offers guidance through this transformation.`
      }
    } else {
      if (lang === 'vi') {
        advice += `Cả ba xuất hiện đảo ngược—một lời mời mạnh mẽ để hoàn toàn xem xét lại câu hỏi của bạn và giả định về "${customQuestion}". Đây là thuốc mạnh mẽ yêu cầu bạn định hướng lại toàn bộ cách tiếp cận của bạn đối với tình huống này.`
      } else {
        advice += `All three appear reversed—a powerful invitation to completely reconsider your question and assumptions about "${customQuestion}". This is profound medicine that asks you to reorient your entire approach to this situation.`
      }
    }
  } else {
    if (reversedCount === 0) {
      if (lang === 'vi') {
        advice += `Cả ba rune đều xuất hiện thẳng đứng—một sự sắp xếp hiếm gặp và mạnh mẽ. Bạn có động lực. Sự khôn ngoan quá khứ của bạn, sự rõ ràng hiện tại và tiềm năng tương lai của bạn đều ở trong dòng chảy tích cực. Tiến lên với sự tự tin.`
      } else {
        advice += `All three runes appear upright—a rare and powerful alignment. You have momentum. Your past wisdom, present clarity, and future potential are all in positive flow. Move forward with confidence.`
      }
    } else if (reversedCount === 1) {
      if (lang === 'vi') {
        advice += `Một rune xuất hiện đảo ngược, gợi ý một khu vực cụ thể cần chú ý. Điều hướng điều này một cách có ý thức trong khi tận dụng năng lượng tích cực của hai khu vực khác.`
      } else {
        advice += `One rune appears reversed, suggesting a specific area requiring attention. Navigate this consciously while leveraging the positive energy of the other two.`
      }
    } else if (reversedCount === 2) {
      if (lang === 'vi') {
        advice += `Hai rune đảo ngược chỉ ra sự chuyển đổi đáng kể. Bạn được yêu cầu từ bỏ các mẫu cũ và chấp nhận sự thay đổi sâu sắc. Rune thẳng đứng cung cấp hướng dẫn thông qua sự chuyển đổi này.`
      } else {
        advice += `Two runes reversed indicate significant transition. You're being asked to release old patterns and embrace deep change. The upright rune offers guidance through this transformation.`
      }
    } else {
      if (lang === 'vi') {
        advice += `Cả ba xuất hiện đảo ngược—một lời mời mạnh mẽ để chuyển đổi. Những gì dường như bị chặn thực sự mời gọi bạn hoàn toàn định hướng lại cách tiếp cận của bạn. Đây là thuốc mạnh mẽ.`
      } else {
        advice += `All three appear reversed—a powerful invitation to transformation. What seems blocked is actually inviting you to completely reorient your approach. This is profound medicine.`
      }
    }
  }
  
  return advice
}

function generateCompleteNarrative(stones, context, customQuestion, lang = 'en') {
  const past = stones[0]
  const present = stones[1]
  const future = stones[2]
  const contextInfo = getContextsByLanguage(lang)[context] || { title: lang === 'vi' ? "Hành trình Cuộc sống Của Bạn" : "Your Life Journey" }
  
  let narrative = `\n`
  
  if (customQuestion && customQuestion.trim()) {
    if (lang === 'vi') {
      narrative += `Về câu hỏi của bạn "${customQuestion}": Bài đọc ba rune của bạn tiết lộ một cung hoàn chỉnh. ${past.name} đã dạy bạn về tình huống này, ${present.name} là đồng minh hiện tại của bạn cho thấy những gì đang hoạt động, và ${future.name} là lời thì thầm của số phận của bạn cho thấy nơi điều này sẽ triển khai. Cùng nhau, họ kể câu chuyện về cách câu hỏi của bạn sẽ giải quyết. Trí tuệ bạn mang từ những trải nghiệm quá khứ với vấn đề này, nhận thức bạn nuôi dưỡng bây giờ và tiềm năng bạn chuyển tới đều là những biểu hiện của một hành trình thống nhất hướng tới sự hiểu biết sâu hơn và hoàn thành liên quan đến tình huống này.`
    } else {
      narrative += `Regarding your question "${customQuestion}": Your three-rune reading reveals a complete arc. ${past.name} has been teaching you about this situation, ${present.name} is your present ally showing you what's at work now, and ${future.name} is your destiny's whisper showing where this will unfold. Together, they tell the story of how your question will resolve. The wisdom you carry from past experiences with this matter, the awareness you cultivate now, and the potential you move toward are all expressions of one unified journey toward deeper truth and fulfillment regarding this situation.`
    }
  } else {
    if (lang === 'vi') {
      narrative += `Trong lĩnh vực ${contextInfo.title}, bài đọc ba rune của bạn tiết lộ một cung hoàn chỉnh. ${past.name} đã là người dạy của bạn, ${present.name} là đồng minh hiện tại của bạn và ${future.name} là lời thì thầm của số phận của bạn. Cùng nhau, họ kể câu chuyện về sự trở thành của bạn trong khu vực sống này. Trí tuệ bạn mang từ quá khứ, nhận thức bạn nuôi dưỡng bây giờ và tiềm năng bạn chuyển tới đều là những biểu hiện của một hành trình thống nhất hướng tới sự hiểu biết sâu hơn và hoàn thành.`
    } else {
      narrative += `In the realm of ${contextInfo.title}, your three-rune reading reveals a complete arc. ${past.name} has been your teacher, ${present.name} is your present ally, and ${future.name} is your destiny's whisper. Together, they tell the story of your becoming in this area of your life. The wisdom you carry from the past, the awareness you cultivate now, and the potential you move toward are all expressions of one unified journey toward deeper truth and fulfillment.`
    }
  }
  
  return narrative
}

function combineRuneMeanings(stone1, stone2, lang = 'en') {
  if (lang === 'vi') {
    return `${stone1.name}'s năng lượng kết hợp với ${stone2.name}'s trí tuệ để tiết lộ tình huống hoàn chỉnh của bạn.`
  }
  return `${stone1.name}'s energy combines with ${stone2.name}'s wisdom to reveal your complete situation.`
}

function generateOverallMessage(stones, context, customQuestion, lang = 'en') {
  if (!Array.isArray(stones) || stones.length !== 2) {
    if (lang === 'vi') {
      return `\nBài đọc của bạn tiết lộ chuyển động và chuyển đổi triển khai trong tình huống của bạn.`
    }
    return `\nYour reading reveals movement and transformation unfolding in your situation.`
  }

  const current = stones[0]
  const outcome = stones[1]

  if (customQuestion && customQuestion.trim()) {
    const questionKey = customQuestion.toLowerCase()
    const currentState = current.reversed 
      ? (lang === 'vi' ? "phải đối mặt với chướng ngại" : "facing obstacles")
      : (lang === 'vi' ? "ở trong dòng chảy tự nhiên" : "in a natural flow")
    
    const outcomeState = outcome.reversed 
      ? (lang === 'vi' ? "đòi hỏi chú ý" : "requiring attention")
      : (lang === 'vi' ? "chuyển động hướng tới giải quyết" : "moving toward resolution")

    if (lang === 'vi') {
      return `\nVề "${customQuestion}": Bạn hiện đang ${currentState}, và điều này đang hướng dẫn bạn đến những hoàn cảnh ${outcomeState}. Các rune gợi ý rằng những gì triển khai sẽ phục vụ tốt nhất của bạn trong vấn đề này.`
    }
    return `\nRegarding "${customQuestion}": You're currently ${currentState}, and this is guiding you toward circumstances ${outcomeState}. The runes suggest that what unfolds will serve your highest good in this matter.`
  }

  const currentState = current.reversed 
    ? (lang === 'vi' ? "phải đối mặt với chướng ngại hoặc sức cản" : "facing obstacles or resistance")
    : (lang === 'vi' ? "ở trong dòng chảy tự nhiên" : "in a natural flow")
  
  const outcomeState = outcome.reversed 
    ? (lang === 'vi' ? "đòi hỏi chú ý và chăm sóc của bạn" : "requiring your attention and care")
    : (lang === 'vi' ? "chuyển động hướng tới sự rõ ràng và giải quyết" : "moving toward clarity and resolution")

  const generalMessages = {
    love: lang === 'vi'
      ? `\nHành trình của trái tim bạn đang chuyển đổi. Bạn hiện đang ${currentState}, và điều này đang hướng dẫn bạn đến một tình huống mối quan hệ ${outcomeState}. Những gì quan trọng bây giờ là giữ mở và xác thực.`
      : `\nYour heart's journey is shifting. You're currently ${currentState}, and this is guiding you toward a relationship situation ${outcomeState}. What matters now is staying open and authentic.`,
    
    career: lang === 'vi'
      ? `\nCon đường công việc của bạn đang phát triển. Ngay bây giờ bạn ${currentState}, nhưng điều này dẫn bạn đến ${outcomeState}. Tin tưởng rằng những thách thức thường xuyên đi trước sự tăng trưởng.`
      : `\nYour work path is evolving. Right now you're ${currentState}, but this is leading you to ${outcomeState}. Trust that challenges often precede growth.`,
    
    health: lang === 'vi'
      ? `\nWellness của bạn đang chuyển đổi. Bạn ${currentState}, chuẩn bị cho bạn một pha ${outcomeState}. Cơ thể và tâm trí của bạn cùng làm việc để có lợi cho bạn.`
      : `\nYour wellness is in transition. You're ${currentState}, which is preparing you for a phase ${outcomeState}. Your body and mind are working together for your benefit.`,
    
    finance: lang === 'vi'
      ? `\nCảnh quan tài chính của bạn đang thay đổi. Hiện tại bạn ${currentState}, và điều này đang hướng dẫn bạn đến hoàn cảnh ${outcomeState}. Vũ trụ điều chỉnh những gì cần điều chỉnh.`
      : `\nYour financial landscape is shifting. Currently you're ${currentState}, and this is directing you toward circumstances ${outcomeState}. The universe adjusts what needs adjusting.`,
    
    personal: lang === 'vi'
      ? `\nThế giới nội tâm của bạn đang chuyển đổi. Bạn ${currentState}, đó chính xác là nơi bạn cần phải lớn thành ${outcomeState}. Tin tưởng vào hành trình của bạn.`
      : `\nYour inner world is transforming. You're ${currentState}, which is exactly where you need to be to grow into ${outcomeState}. Trust your journey.`,
    
    general: lang === 'vi'
      ? `\nCuộc sống của bạn đang chuyển động thông qua một chu kỳ tự nhiên. Bạn ${currentState}, và điều này đang hướng dẫn bạn đến một pha ${outcomeState}. Mỗi chương có mục đích.`
      : `\nYour life is moving through a natural cycle. You're ${currentState}, and this is guiding you toward a phase ${outcomeState}. Every chapter has purpose.`
  }

  return generalMessages[context] || generalMessages.general
}

// Draw runes (1-3 stones)
app.post("/api/draw", (req, res) => {
  const { count, context, question } = req.body
  const lang = req.query.lang || 'en'
  
  if (!count || count < 1 || count > 3) {
    return res.status(400).json({ error: "Must draw between 1 and 3 runes" })
  }
  
  const contextData = getContextsByLanguage(lang)
  
  // Allow either predefined context or custom context
  let contextInfo = contextData[context]
  if (!contextInfo && context !== 'custom') {
    return res.status(400).json({ error: "Invalid context" })
  }
  
  // If custom context, create a generic one
  if (context === 'custom') {
    contextInfo = {
      title: lang === 'vi' ? "Câu hỏi của bạn" : "Your Question",
      interpretation: lang === 'vi' ? "Hướng dẫn cho cuộc điều tra cụ thể của bạn" : "Guidance for your specific inquiry"
    }
  }

  const runes = getRunesByLanguage(lang)
  const drawn = []
  const usedIds = new Set()
  
  // Draw unique runes
  while (drawn.length < count) {
    const randomId = Math.floor(Math.random() * runes.length) + 1
    if (!usedIds.has(randomId)) {
      usedIds.add(randomId)
      const rune = runes.find(r => r.id === randomId)
      const isReversed = Math.random() > 0.5
      drawn.push({
        ...rune,
        reversed: isReversed,
        reversedMeaning: rune.reversed,
        interpretation: isReversed ? rune.reversed : rune.meaning
      })
    }
  }

  // Prepare reading based on number of stones
  let readingType = ""
  let readingDescription = ""
  
  if (lang === 'vi') {
    if (count === 1) {
      readingType = "Bài Đọc Một Rune"
      readingDescription = "Một câu trả lời tập trung cho câu hỏi của bạn"
    } else if (count === 2) {
      readingType = "Bài Đọc Hai Rune"
      readingDescription = "Cho thấy tình huống hiện tại và kết quả tiềm năng"
    } else {
      readingType = "Bài Đọc Ba Rune"
      readingDescription = "Ảnh hưởng quá khứ, tình huống hiện tại và hướng dẫn tương lai"
    }
  } else {
    if (count === 1) {
      readingType = "Single Rune"
      readingDescription = "A focused answer to your question"
    } else if (count === 2) {
      readingType = "Two Rune"
      readingDescription = "Shows the current situation and potential outcome"
    } else {
      readingType = "Three Rune"
      readingDescription = "Past influence, present situation, and future guidance"
    }
  }

  // Generate comprehensive reading
  const comprehensiveReading = generateRuneInterpretation(drawn, contextInfo, context, question, lang)

  res.json({
    context: contextInfo,
    readingType,
    readingDescription,
    stones: drawn,
    comprehensiveReading,
    customQuestion: question,
    timestamp: new Date().toISOString()
  })
})

// Save a reading (optional, for future implementation)
app.post("/api/readings", (req, res) => {
  const { context, stones, notes } = req.body
  
  if (!context || !stones) {
    return res.status(400).json({ error: "Context and stones are required" })
  }

  const reading = {
    id: Date.now(),
    context,
    stones,
    notes: notes || "",
    timestamp: new Date().toISOString()
  }

  res.status(201).json(reading)
})

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: "Something went wrong" })
})

app.listen(PORT, () => {
  console.log(`✅ Nordic Runes backend running on http://localhost:${PORT}`)
})
