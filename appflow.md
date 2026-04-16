================================================================================
FIGHT CLUB APP - COMPLETE FLOW DOCUMENTATION
================================================================================

PROJECT OVERVIEW
================================================================================
Fight Club is a personal habit tracker for friends to track daily progress 
across multiple "spheres" (activities/goals).

Each user has 3 pre-defined members:
  - Varun
  - Vineeth
  - Ashwin

Each member has up to 5 spheres (activities):
  - DSA
  - Building
  - Fitness
  - Deep Work
  - Work

Users track daily completion for each sphere.

================================================================================
SECTION 1: INITIAL APP LOAD
================================================================================

STEP 1: User opens app
  → Browser loads index.html
  → React mounts App.jsx component

STEP 2: App.jsx initializes state
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  
  const [members, setMembers] = useState(() =>
    MEMBERS_LIST.map((name) => store.get(`fc2_${name}`) || defaultMember(name))
  );
  
  const [useBackend, setUseBackend] = useState(!!getAuthToken());

STEP 3: App checks if user is authenticated
  if (!user) {
    return <AuthView onAuthSuccess={handleAuthSuccess} />;
  }
  
  → If NO user in localStorage: Show login/signup screen
  → If user EXISTS: Show member selection screen

================================================================================
SECTION 2: AUTHENTICATION (AUTHVIEW COMPONENT)
================================================================================

SCENARIO A: USER SIGNS UP
────────────────────────────────────────────────────────────────────────────

STEP 1: User fills form in AuthView
  Username: "testuser"
  Email: "test@example.com"
  Password: "password123"
  Display Name: "Test User"

STEP 2: User clicks "Create Account"
  → handleSubmit() triggered
  → Loading state set to true

STEP 3: Frontend calls API
  authAPI.register(username, email, password, displayName)
    → Calls: POST http://localhost:3001/api/auth/register
    → Body: { username, email, password, displayName }
    → Headers: { Authorization: Bearer <token> (if exists) }

STEP 4: Backend receives request (authController.register)
  try {
    const { username, email, password, displayName } = req.body;
    
    // Validate
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(409).json({ message: 'User already exists' });
    }
    
    // Create new user
    const user = new User({
      username,
      email,
      password, // Gets hashed in User.pre('save') middleware
      displayName: displayName || username,
    });
    
    await user.save();
    
    // Generate JWT token (valid for 30 days)
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    
    // Return response
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: user.toJSON(), // Returns user without password
    });
  }

STEP 5: MongoDB saves user
  Collection: users
  Document:
  {
    _id: ObjectId("65f7a1b2c3d4e5f6g7h8i9j0"),
    username: "testuser",
    email: "test@example.com",
    password: "$2a$10$...[hashed]...", // bcryptjs hashed
    displayName: "Test User",
    createdAt: 2026-04-17T10:30:00.000Z,
    updatedAt: 2026-04-17T10:30:00.000Z
  }

STEP 6: Frontend receives response
  response = {
    message: 'User registered successfully',
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    user: {
      _id: "65f7a1b2c3d4e5f6g7h8i9j0",
      username: "testuser",
      email: "test@example.com",
      displayName: "Test User"
    }
  }

STEP 7: Frontend stores credentials
  setAuthToken(response.token)
    → Stores token in localStorage.authToken
  
  localStorage.setItem("user", JSON.stringify(response.user))
    → Stores user object in localStorage.user

STEP 8: Frontend calls onAuthSuccess()
  setUser(response.user)
    → user state now populated
  
  setUseBackend(true)
    → Triggers fetchMembersFromBackend useEffect

STEP 9: App redirects from AuthView to member selection
  → App now shows member cards (Varun, Vineeth, Ashwin)

────────────────────────────────────────────────────────────────────────────

SCENARIO B: USER LOGS IN
────────────────────────────────────────────────────────────────────────────

STEP 1: User enters credentials
  Username: "testuser"
  Password: "password123"

STEP 2: User clicks "Sign In"
  → handleSubmit() triggered
  → isLogin state is true

STEP 3: Frontend calls API
  authAPI.login(username, password)
    → Calls: POST http://localhost:3001/api/auth/login
    → Body: { username, password }

STEP 4: Backend handles login (authController.login)
  try {
    const { username, password } = req.body;
    
    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    
    // Compare password (bcryptjs)
    const isPasswordValid = await user.comparePassword(password);
    // comparePassword method: bcryptjs.compare(enteredPassword, this.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    
    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    
    // Return response
    res.status(200).json({
      message: 'Login successful',
      token,
      user: user.toJSON(),
    });
  }

STEP 5: Frontend stores credentials (same as signup STEP 7-9)

================================================================================
SECTION 3: MEMBER INITIALIZATION (FIRST LOGIN)
================================================================================

STEP 1: useEffect runs (after user state updates)
  useEffect(() => {
    fetchMembersFromBackend();
  }, [fetchMembersFromBackend]);

STEP 2: fetchMembersFromBackend() runs
  const fetchMembersFromBackend = useCallback(async () => {
    if (!useBackend || !user) return;
    
    try {
      const response = await memberAPI.getMembers();
      // Calls: GET http://localhost:3001/api/members
      // Headers: { Authorization: Bearer <token> }

STEP 3: Backend fetches members (memberController.getMembers)
  export const getMembers = async (req, res) => {
    try {
      const members = await Member.find({ userId: req.user.userId });
      // req.user.userId comes from JWT token via authentication middleware
      res.status(200).json({ members });
    }
  }

STEP 4: First-time users have no members
  response.members = [] // Empty array
  
  TRIGGER MEMBER CREATION:
  
  const defaultMembers = MEMBERS_LIST.map((name) => defaultMember(name));
  // MEMBERS_LIST = ["varun", "vineeth", "ashwin"]
  
  for (const member of defaultMembers) {
    await memberAPI.createMember(member.name, member.displayName, member.spheres);
    // Calls: POST http://localhost:3001/api/members
    // Body: { name, displayName, spheres }

STEP 5: Backend creates members (memberController.createMember)
  export const createMember = async (req, res) => {
    try {
      const { name, displayName, spheres } = req.body;
      
      // Check if member already exists
      const existingMember = await Member.findOne({ userId: req.user.userId, name });
      if (existingMember) {
        return res.status(409).json({ message: 'Member already exists' });
      }
      
      // Create member
      const member = new Member({
        userId: req.user.userId,
        name,
        displayName,
        spheres: spheres || [],
        logs: new Map(),
        notes: [],
        setupDone: false,
      });
      
      await member.save();
      res.status(201).json({ message: 'Member created', member });
    }
  }

STEP 6: MongoDB saves 3 member documents
  Collection: members
  
  Document 1:
  {
    _id: ObjectId("65f7a1b2c3d4e5f6g7h8i9j1"),
    userId: ObjectId("65f7a1b2c3d4e5f6g7h8i9j0"),
    name: "varun",
    displayName: "Varun",
    spheres: [
      { id: "dsa", label: "DSA", icon: "1", color: "#8B5CF6", desc: "Striver's — 1 problem minimum" },
      { id: "building", label: "Building", icon: "2", color: "#A78BFA", desc: "Personal projects" },
      { id: "fitness", label: "Fitness", icon: "3", color: "#7C3AED", desc: "Gym + Sport + Walk" },
      { id: "deepwork", label: "Deep Work", icon: "4", color: "#6D28D9", desc: "Docs, books, videos" },
      { id: "work", label: "Work", icon: "5", color: "#9333EA", desc: "Code review + internship" }
    ],
    logs: {},
    notes: [],
    setupDone: true,
    createdAt: 2026-04-17T10:35:00.000Z,
    updatedAt: 2026-04-17T10:35:00.000Z
  }
  
  (Similar for vineeth and ashwin with setupDone: false)

STEP 7: Frontend receives all members
  response.members = [
    { _id: "...", name: "varun", displayName: "Varun", spheres: [...], setupDone: true, ... },
    { _id: "...", name: "vineeth", displayName: "Vineeth", spheres: [], setupDone: false, ... },
    { _id: "...", name: "ashwin", displayName: "Ashwin", spheres: [], setupDone: false, ... }
  ]

STEP 8: Frontend updates state
  setMembers(backendMembers);
  // React re-renders with member cards

STEP 9: User sees member selection screen
  Three cards displayed:
  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
  │ Varun       │  │ Vineeth     │  │ Ashwin      │
  │ 5 SPHERES   │  │ READY TO    │  │ READY TO    │
  │ DEFINED     │  │ SETUP       │  │ SETUP       │
  │ [ENTER]     │  │ [ENTER]     │  │ [ENTER]     │
  └─────────────┘  └─────────────┘  └─────────────┘

================================================================================
SECTION 4: MEMBER SETUP (IF NEEDED)
================================================================================

STEP 1: User clicks ENTER on Vineeth (not set up yet)
  onClick={() => setActiveMember("vineeth")}

STEP 2: App renders SphereSetup component
  <SphereSetup member={vineethMember} onSave={updateMember} />

STEP 3: User defines spheres
  – Click "ADD SPHERE" button
  – Enter sphere name: "Coding"
  – Select color: "#8B5CF6"
  – Enter description: "Daily coding practice"
  – Repeat for up to 5 spheres

STEP 4: User clicks "CONFIGURE"
  → onSave(updatedMember) called
  → updateMember(updatedMember) triggered

STEP 5: Frontend updates state
  setMembers((prev) => prev.map((m) => 
    m.name === updated.name ? updated : m
  ));

STEP 6: useEffect detects change
  useEffect(() => {
    const saveMembers = async () => {
      if (useBackend && user) {
        for (const member of members) {
          if (member._id) {
            await memberAPI.updateMember(member._id, {
              spheres: member.spheres,
              logs: member.logs,
              notes: member.notes,
              setupDone: member.setupDone,
            });
          }
        }
      }
    };
    
    const timer = setTimeout(saveMembers, 500); // Debounce
    return () => clearTimeout(timer);
  }, [members, useBackend, user]);

STEP 7: Frontend calls API with updated member
  PUT http://localhost:3001/api/members/{vineethId}
  Body: {
    spheres: [
      { id: "coding", label: "Coding", icon: "1", color: "#8B5CF6", desc: "Daily coding practice" },
      ...
    ],
    setupDone: true
  }
  Headers: { Authorization: Bearer <token> }

STEP 8: Backend updates member (memberController.updateMember)
  export const updateMember = async (req, res) => {
    try {
      const { id } = req.params;
      const { spheres, logs, notes, setupDone } = req.body;
      
      const member = await Member.findById(id);
      
      // Security: verify this member belongs to current user
      if (!member || member.userId.toString() !== req.user.userId) {
        return res.status(404).json({ message: 'Member not found' });
      }
      
      if (spheres) member.spheres = spheres;
      if (logs) member.logs = new Map(Object.entries(logs));
      if (notes) member.notes = notes;
      if (setupDone !== undefined) member.setupDone = setupDone;
      
      await member.save();
      res.status(200).json({ message: 'Member updated', member });
    }
  }

STEP 9: MongoDB updates document
  db.members.updateOne(
    { _id: vineethId },
    {
      $set: {
        spheres: [...],
        setupDone: true,
        updatedAt: new Date()
      }
    }
  )

STEP 10: User directed to main dashboard
  activeMember = "vineeth"
  Shows tabs: TODAY PROGRESS, CALENDAR VIEW, LEADERBOARD, NOTES

================================================================================
SECTION 5: MAIN DASHBOARD - TODAY PROGRESS TAB
================================================================================

STEP 1: User views TODAY PROGRESS for Vineeth
  TodayView component renders with:
  – Today's date: April 17, 2026
  – List of all spheres

STEP 2: Spheres displayed
  ┌──────────────────────────────┐
  │ ☐ Coding                      │ (unchecked)
  │ ☐ Reading                     │ (unchecked)
  │ ☐ Exercise                    │ (unchecked)
  └──────────────────────────────┘

STEP 3: User clicks checkbox for "Coding"
  → Checkbox state changes: false → true
  → updateMember() called with updated logs

STEP 4: Frontend updates state
  const today = "2026-04-17";
  const logKey = `${today}_coding`;
  
  const updatedMember = {
    ...member,
    logs: {
      ...member.logs,
      "2026-04-17_coding": true
    }
  };
  
  setMembers((prev) => prev.map((m) => 
    m.name === "vineeth" ? updatedMember : m
  ));

STEP 5: useEffect detects changes (debounced 500ms)
  setTimeout(saveMembers, 500);

STEP 6: Frontend calls API
  PUT http://localhost:3001/api/members/{vineethId}
  Body: {
    logs: {
      "2026-04-17_coding": true,
      "2026-04-17_reading": false,
      "2026-04-17_exercise": false
    }
  }

STEP 7: Backend updates logs
  member.logs = new Map(Object.entries({
    "2026-04-17_coding": true,
    "2026-04-17_reading": false,
    "2026-04-17_exercise": false
  }));
  
  await member.save();

STEP 8: MongoDB updates member.logs in database
  db.members.updateOne(
    { _id: vineethId },
    {
      $set: {
        logs: {
          "2026-04-17_coding": true,
          "2026-04-17_reading": false,
          "2026-04-17_exercise": false
        }
      }
    }
  )

STEP 9: Frontend receives confirmation
  → Checkbox now shows as checked (green)
  → Data persisted in MongoDB

================================================================================
SECTION 6: CALENDAR VIEW TAB
================================================================================

STEP 1: User clicks CALENDAR VIEW tab
  setActiveTab("calendar")

STEP 2: CalendarView component renders
  Displays monthly grid for April 2026:
  
  April 2026
  Mo Tu We Th Fr Sa Su
                  1  2
   3  4  5  6  7  8  9
  10 11 12 13 14 15 16
  17 18 19 20 21 22 23
  24 25 26 27 28 29 30

STEP 3: Each day colored by sphere completion
  April 17 (today):
  – Coding (green) ✓
  – Reading (gray) ✗
  – Exercise (gray) ✗
  
  Sphere colors used:
  – Completed: #8B5CF6 (purple)
  – Incomplete: #222222 (dark gray)

STEP 4: User clicks on a date
  → Shows details for that day
  → Can update completion status
  → Changes sync to backend same as TODAY PROGRESS

STEP 5: Visual feedback
  Green highlights show consistency
  User can see streak/pattern across month

================================================================================
SECTION 7: LEADERBOARD TAB
================================================================================

STEP 1: User clicks LEADERBOARD tab
  setActiveTab("board")

STEP 2: LeaderboardView receives allMembers
  <LeaderboardView allMembers={members}/>
  
  members = [
    { name: "varun", spheres: [...], logs: { "2026-04-17_dsa": true, ... }, ... },
    { name: "vineeth", spheres: [...], logs: { "2026-04-17_coding": true, ... }, ... },
    { name: "ashwin", spheres: [...], logs: { "2026-04-17_..": false, ... }, ... }
  ]

STEP 3: LeaderboardView calculates stats
  For each member:
    – Total spheres: 5
    – Completed today: 2
    – Completion %: (2/5) * 100 = 40%
    – Streak: Days in a row with all spheres complete
    – Per-sphere completion rate

STEP 4: Rankings displayed
  Rank 1: Varun - 80% (4/5 spheres)
  Rank 2: Ashwin - 60% (3/5 spheres)
  Rank 3: Vineeth - 40% (2/5 spheres)

STEP 5: Breakdown shown
  Varun's Performance:
  ├─ DSA: 20/30 days (67%)
  ├─ Building: 15/30 days (50%)
  ├─ Fitness: 25/30 days (83%)
  ├─ Deep Work: 18/30 days (60%)
  └─ Work: 22/30 days (73%)

STEP 6: User can switch members
  Click member selector at top
  → Shows different member's leaderboard
  → Real-time data from state

================================================================================
SECTION 8: NOTES TAB
================================================================================

STEP 1: User clicks NOTES tab
  setActiveTab("notes")

STEP 2: NotesView component renders
  Shows:
  – List of all notes for this member
  – Add note button
  – Delete note buttons

STEP 3: User clicks "ADD NOTE"
  Modal/form opens:
  – Content input: "Finished chapter 5"
  – Date: "2026-04-17" (auto-filled today)
  – Optional sphere: "Reading" (dropdown)

STEP 4: User submits note
  → memberAPI.addNote(memberId, content, date, sphereId)
  → Frontend calls: POST http://localhost:3001/api/members/{id}/notes
  
  Body: {
    content: "Finished chapter 5",
    date: "2026-04-17",
    sphereId: "reading"
  }

STEP 5: Backend creates note (memberController.addNote)
  const note = {
    id: `note_${Date.now()}`,
    date: "2026-04-17",
    content: "Finished chapter 5",
    sphereId: "reading"
  };
  
  member.notes.push(note);
  await member.save();

STEP 6: MongoDB adds note to member.notes array
  db.members.updateOne(
    { _id: vineethId },
    {
      $push: {
        notes: {
          id: "note_1713350400000",
          date: "2026-04-17",
          content: "Finished chapter 5",
          sphereId: "reading"
        }
      }
    }
  )

STEP 7: Note appears in list
  April 17:
  ├─ [Reading] "Finished chapter 5" [DELETE]
  ├─ "Good day overall" [DELETE]
  └─ [Fitness] "Did 30 min cardio" [DELETE]

STEP 8: User clicks DELETE on note
  → memberAPI.deleteNote(memberId, noteId)
  → Backend removes note from array
  → Frontend updates state

================================================================================
SECTION 9: SWITCHING MEMBERS
================================================================================

STEP 1: User clicks member selector button at top
  Style: { background: isActive?"#8B5CF6":"#111", ... }
  
  Current: Vineeth (highlighted purple)
  Available: Varun, Ashwin

STEP 2: User clicks "VARUN"
  setActiveMember("varun")

STEP 3: App switches context
  – activeMember state updates: "varun"
  – All components re-render with Varun's data
  – TodayView shows Varun's spheres
  – Logs show Varun's completion status
  – Notes show Varun's notes

STEP 4: User sees different data
  Varun has 5 spheres (already set up)
  Shows progress across different activities

STEP 5: Changes sync properly
  Every update applies to selected member
  Other members' data unchanged
  Backend validates userId matches

================================================================================
SECTION 10: LOGOUT
================================================================================

STEP 1: User clicks LOGOUT button
  onClick={handleLogout}

STEP 2: handleLogout() executes
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    setUser(null);
    setUseBackend(false);
    setActiveMember(null);
    setActiveTab("today");
  };

STEP 3: LocalStorage cleared
  localStorage: {
    // user: deleted
    // authToken: deleted
  }

STEP 4: All state reset to defaults
  user = null
  useBackend = false
  activeMember = null
  activeTab = "today"

STEP 5: App re-renders
  if (!user) {
    return <AuthView onAuthSuccess={handleAuthSuccess} />;
  }
  
  → Shows login/signup screen again

STEP 6: User can login again
  New session starts
  Old session data discarded
  Server doesn't invalidate JWT (stateless)
  Token expires after 30 days anyway

================================================================================
SECTION 11: DATA PERSISTENCE & SYNC
================================================================================

REALTIME SYNC FLOW:
──────────────────

Action: User checks "DSA" sphere
  ↓
setMembers updates React state
  ↓
useEffect dependenc change detected
  ↓
setTimeout(saveMembers, 500) // Debounce
  ↓
memberAPI.updateMember() called
  ↓
PUT /api/members/{id} request sent
  ↓
Backend validates JWT & userId
  ↓
MongoDB updates member document
  ↓
Response sent back to frontend
  ↓
New data propagates to UI
  ↓
✓ Checkbox shows checked

FALLBACK TO LOCALSTORAGE:
─────────────────────────

If useBackend === false:
  → Network error occurred
  → MongoDB connection failed
  → Frontend falls back to localStorage
  
  members.forEach((m) => store.set(`fc2_${m.name}`, m));
  
  Data saved locally:
  localStorage.fc2_varun = { spheres: [...], logs: {...}, ... }
  localStorage.fc2_vineeth = { ... }
  localStorage.fc2_ashwin = { ... }
  
  On next refresh:
  const saved = store.get(`fc2_${name}`);
  // Returns object from localStorage or null

HYBRID APPROACH:
────────────────

  ✓ Primary: Backend (MongoDB)
  ✓ Fallback: Frontend (localStorage)
  
  If backend unavailable → automatic fallback
  Data still works locally
  Syncs to backend when connection restored

================================================================================
SECTION 12: ERROR HANDLING
================================================================================

SCENARIO 1: MongoDB Atlas IP not whitelisted
────────────────────────────────────────────

Backend startup:
  → MongoDB connection fails
  → Error logged: "MongoDB connection error: ..."
  → Backend server still runs
  → API endpoints return errors
  
Frontend attempts:
  → API call fails (no database)
  → fetch() throws error
  → Caught in fetchWithAuth:
    
    catch (error) {
      if (error instanceof TypeError) {
        throw new Error('Network error: Unable to connect to server');
      }
    }
  
User sees:
  → Error message in AuthView
  → Cannot proceed to dashboard
  → Must wait for backend to connect

FIX:
  1. Go to MongoDB Atlas
  2. Network Access → Add Current IP
  3. Restart backend: npm run dev
  4. Backend connects: "Connected to MongoDB"
  5. User can retry login

────────────────────────────────────────────

SCENARIO 2: Invalid credentials on login
─────────────────────────────────────────

User enters:
  Username: "wronguser"
  Password: "nope"

Backend validates:
  const user = await User.findOne({ username: "wronguser" });
  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

Frontend shows error:
  setError("Invalid username or password");
  
  <div style={{ background: "#330000", color: "#ff6666" }}>
    Invalid username or password
  </div>

User can retry:
  ✓ Clear form
  ✓ Try different credentials

────────────────────────────────────────────

SCENARIO 3: Network timeout
──────────────────────────────

User clicks checkbox
  → API request starts
  → Network drops
  → Request hangs for 30s
  → Timeout error

Frontend handles:
  catch (error) {
    if (error instanceof TypeError) {
      setError('Network error: Unable to connect to server');
    }
    // Falls back to localStorage
    setUseBackend(false);
  }

User sees:
  ✓ Error notification
  ✓ Data still saves locally
  ✓ Can continue working offline

Automatic recovery:
  ✓ When network returns
  ✓ User can manually sync
  ✓ Or refresh page

────────────────────────────────────────────

SCENARIO 4: JWT token expired
─────────────────────────────

After 30 days:
  Token becomes invalid
  Backend returns: 401 Unauthorized
  
Frontend should:
  1. Detect 401 error
  2. Clear localStorage
  3. Redirect to login
  
Current implementation:
  (Could be enhanced)
  
Fix implemented:
  if (response.status === 401) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
  }

================================================================================
SECTION 13: DATABASE SCHEMA (MONGODB)
================================================================================

USERS COLLECTION:
────────────────

{
  _id: ObjectId("65f7a1b2c3d4e5f6g7h8i9j0"),
  username: "testuser",              // Unique
  email: "test@example.com",         // Unique
  password: "$2a$10$...[hashed]...", // Bcryptjs hash
  displayName: "Test User",
  createdAt: ISODate("2026-04-17T10:30:00.000Z"),
  updatedAt: ISODate("2026-04-17T10:30:00.000Z"),
  __v: 0
}

Indexes:
  ✓ username (unique)
  ✓ email (unique)

────────────────────────────────────────

MEMBERS COLLECTION:
───────────────────

{
  _id: ObjectId("65f7a1b2c3d4e5f6g7h8i9j1"),
  userId: ObjectId("65f7a1b2c3d4e5f6g7h8i9j0"), // Foreign key
  name: "varun",
  displayName: "Varun",
  spheres: [
    {
      id: "dsa",
      label: "DSA",
      icon: "1",
      color: "#8B5CF6",
      desc: "Striver's — 1 problem minimum"
    },
    ...
  ],
  logs: {
    "2026-04-17_dsa": true,
    "2026-04-17_building": false,
    "2026-04-17_fitness": true,
    "2026-04-17_deepwork": false,
    "2026-04-17_work": true,
    "2026-04-16_dsa": true,
    ...
  },
  notes: [
    {
      id: "note_1713350400000",
      date: "2026-04-17",
      content: "Finished chapter 5",
      sphereId: "dsa"
    },
    ...
  ],
  setupDone: true,
  createdAt: ISODate("2026-04-17T10:35:00.000Z"),
  updatedAt: ISODate("2026-04-17T11:45:30.000Z"),
  __v: 0
}

Indexes:
  ✓ userId + name (unique compound)
  - Ensures one member per user per name

================================================================================
SECTION 14: API ENDPOINTS REFERENCE
================================================================================

AUTH ENDPOINTS:
───────────────

POST /api/auth/register
  Headers: Content-Type: application/json
  Body: {
    username: string (required),
    email: string (required),
    password: string (required),
    displayName: string (optional)
  }
  Response: {
    message: "User registered successfully",
    token: "eyJhbGc...",
    user: { _id, username, email, displayName }
  }
  Status: 201 Created

POST /api/auth/login
  Headers: Content-Type: application/json
  Body: {
    username: string (required),
    password: string (required)
  }
  Response: {
    message: "Login successful",
    token: "eyJhbGc...",
    user: { _id, username, email, displayName }
  }
  Status: 200 OK

GET /api/auth/me
  Headers: Authorization: Bearer <token>
  Response: {
    user: { _id, username, email, displayName }
  }
  Status: 200 OK
  Error: 401 Unauthorized (no token or invalid)

────────────────────────────────────────

MEMBER ENDPOINTS:
─────────────────

GET /api/members
  Headers: Authorization: Bearer <token>
  Response: {
    members: [
      { _id, userId, name, displayName, spheres, logs, notes, setupDone },
      ...
    ]
  }
  Status: 200 OK

POST /api/members
  Headers: Authorization: Bearer <token>
  Body: {
    name: string (required),
    displayName: string (required),
    spheres: array (optional)
  }
  Response: {
    message: "Member created",
    member: { _id, userId, name, displayName, spheres, ... }
  }
  Status: 201 Created

GET /api/members/:id
  Headers: Authorization: Bearer <token>
  Response: {
    member: { _id, userId, name, displayName, ... }
  }
  Status: 200 OK
  Error: 404 Not Found

PUT /api/members/:id
  Headers: Authorization: Bearer <token>
  Body: {
    spheres: array (optional),
    logs: object (optional),
    notes: array (optional),
    setupDone: boolean (optional)
  }
  Response: {
    message: "Member updated",
    member: { _id, userId, ... }
  }
  Status: 200 OK

DELETE /api/members/:id
  Headers: Authorization: Bearer <token>
  Response: {
    message: "Member deleted"
  }
  Status: 200 OK

────────────────────────────────────────

LOGS & NOTES:
──────────────

PUT /api/members/:id/log
  Headers: Authorization: Bearer <token>
  Body: {
    date: "2026-04-17" (required),
    sphereId: "dsa" (required),
    completed: boolean (required)
  }
  Response: {
    message: "Log updated",
    member: { ... with updated logs }
  }
  Status: 200 OK

POST /api/members/:id/notes
  Headers: Authorization: Bearer <token>
  Body: {
    content: string (required),
    date: "2026-04-17" (required),
    sphereId: string (optional)
  }
  Response: {
    message: "Note added",
    note: { id, date, content, sphereId }
  }
  Status: 201 Created

DELETE /api/members/:id/notes/:noteId
  Headers: Authorization: Bearer <token>
  Response: {
    message: "Note deleted"
  }
  Status: 200 OK

================================================================================
SECTION 15: SECURITY CONSIDERATIONS
================================================================================

PASSWORD HASHING:
────────────────

User Password: "password123"

Before Database:
  ✓ Hashed using bcryptjs (salt rounds: 10)
  ✓ User.pre('save') middleware runs
  ✓ Bcryptjs hash: $2a$10$...[60 char hash]...
  ✓ Original password discarded
  ✓ Only hash stored in MongoDB

On Login:
  ✓ User enters password
  ✓ Retrieved user.password (hash)
  ✓ bcryptjs.compare(entered, stored)
  ✓ Returns: true/false (never stored)
  ✓ Password removal on response: user.toJSON()

────────────────────────────────────────

JWT TOKEN AUTHENTICATION:
────────────────────────

Token Structure:
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
  eyJ1c2VySWQiOiI2NWY3YTFiMmMzZDRlNWY2ZzdoOGk5ajAiLCJpYXQiOjE3MTMzNTAyMDB9.
  _K9X...

Header:
  { alg: "HS256", typ: "JWT" }

Payload:
  { userId: "65f7a1b2c3d4e5f6g7h8i9j0", iat: 1713350200 }

Signature:
  HMACSHA256(header + payload + secret)
  Secret: process.env.JWT_SECRET

Expiration:
  ✓ 30 days from issuance
  ✓ Token invalid after expiration
  ✓ User must re-login

Usage:
  ✓ Stored in localStorage
  ✓ Sent in Authorization header: Bearer <token>
  ✓ Backend verifies signature & expiration
  ✓ Extracts userId for authorization
  ✓ Stateless: no session database needed

────────────────────────────────────────

DATA ISOLATION:
───────────────

Each request checks:
  export const auth = (req, res, next) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Contains userId
      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid or expired token' });
    }
  };

Member endpoints verify:
  if (!member || member.userId.toString() !== req.user.userId) {
    return res.status(404).json({ message: 'Member not found' });
  }

Result:
  ✓ User A cannot access User B's members
  ✓ User A cannot modify User B's spheres
  ✓ User A cannot see User B's logs/notes
  ✓ Data strictly isolated by userId

────────────────────────────────────────

CORS CONFIGURATION:
───────────────────

Allowed Origins:
  ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:4173']

Restrictions:
  ✓ Only frontend from these origins can call backend
  ✓ Browser enforces CORS rules
  ✓ Blocks cross-origin requests from other domains
  ✓ Credentials: true allows cookies/auth headers

================================================================================
SECTION 16: ENVIRONMENT VARIABLES
================================================================================

BACKEND (.env):
────────────────

PORT=3001
  → Server listens on port 3001
  → Can change to any available port

MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/?appName=Cluster0
  → MongoDB Atlas connection string
  → Includes: username, password, cluster, database
  → Format: mongodb+srv://[user]:[password]@[cluster].mongodb.net/[database]

JWT_SECRET=your_jwt_secret_key_change_this_in_production
  → Secret key for signing JWT tokens
  → MUST be secret (never share)
  → Should be long random string in production

NODE_ENV=development
  → Environment mode: development/production
  → Controls logging level, error messages, optimization

FRONTEND (.env):
───────────────

VITE_API_URL=http://localhost:3001/api
  → Base URL for all API calls
  → Used in src/utils/api.js
  → Imported via import.meta.env.VITE_API_URL

PRODUCTION CHANGES:
───────────────────

Backend:
  PORT=443 (or proxy to 443)
  MONGODB_URI=production_atlas_uri
  JWT_SECRET=very_long_random_secret_key
  NODE_ENV=production

Frontend:
  VITE_API_URL=https://yourapi.com/api
  Build command: npm run build
  Deploy to CDN: Vercel, Netlify, etc.

================================================================================
SECTION 17: KEY TAKEAWAYS
================================================================================

1. AUTHENTICATION
   – Passwords hashed with bcryptjs
   – JWT tokens for stateless auth
   – 30-day token expiration
   – Credentials stored in localStorage

2. DATA SYNC
   – Real-time sync to MongoDB
   – Debounced (500ms) to prevent spam
   – Automatic fallback to localStorage
   – All updates validated by backend

3. MEMBER ISOLATION
   – Each user has separate members
   – userId ensures data privacy
   – Backend validates all requests
   – Cannot access other users' data

4. WORKFLOW
   Register/Login → Members created → Setup spheres → Track progress → Logout

5. PERSISTENCE
   – Primary: MongoDB (authoritative)
   – Fallback: localStorage (offline backup)
   – Hybrid approach handles network issues

6. SCALABILITY
   – Stateless backend (all info in JWT)
   – Database queries optimized with indexes
   – API designed for mobile/desktop
   – Ready for future features (teams, sharing)

================================================================================
END OF DOCUMENT
================================================================================

This document covers the complete flow from user registration through
all features of the Fight Club application. Use this as a reference
for understanding, debugging, or extending the system.