rules_version = '2';
// Allow read/write access on all documents to any user signed in to the application
service cloud.firestore {
  match /databases/{database}/documents {
  			
        function isSignedIn() {
          return request.auth != null;
        }
        
         function isUserEmailVerified() {
          return request.auth.token.email_verified == true;
        }
        
        function isAdmin() {
          return request.auth.token.admin == true && isUserEmailVerified();
        }
        
        function isManager() {
          return request.auth.token.manager == true && isUserEmailVerified();
        }
        
   	 match /renters/{renter} {
      allow read: if isSignedIn();
      allow create: if isSignedIn() && isAdmin() || isManager();
      allow update: if isSignedIn() && isAdmin() || isManager();
      allow delete: if isSignedIn() && isAdmin();
    }
    match /rooms/{room} {
      allow read: if isSignedIn();
      allow create: if isSignedIn() && isAdmin() || isManager();
      allow update: if isSignedIn() && isAdmin() || isManager();
      allow delete: if isSignedIn() && isAdmin();
    }
    match /payments/{payment} {
      allow read: if isSignedIn();
      allow create: if isSignedIn() && isAdmin() || isManager();
      allow update: if isSignedIn() && isAdmin() || isManager();
      allow delete: if isSignedIn() && isAdmin();
    }
    match /expenses/{expense} {
      allow read: if isSignedIn();
      allow create: if isSignedIn() && isAdmin() || isManager();
      allow update: if isSignedIn() && isAdmin() || isManager();
      allow delete: if isSignedIn() && isAdmin();
    }
     match /settings/{setting} {
      allow read: if isSignedIn();
      allow create: if isSignedIn() && isAdmin() || isManager();
      allow update: if isSignedIn() && isAdmin() || isManager();
      allow delete: if isSignedIn() && isAdmin();
    }
     match /users/{user} {
      allow read: if isSignedIn();
      allow create: if isSignedIn() && isAdmin() || isManager();
      allow update: if isSignedIn() && isAdmin() || isManager();
      allow delete: if isSignedIn() && isAdmin();
    } 
    match /Finances/{finances} {
      allow read: if isSignedIn();
      allow create: if isSignedIn() && (isManager() || isAdmin());
      allow update: if isSignedIn() &&  (isManager() || isAdmin());
      allow delete: if isSignedIn() && isAdmin();
    }
  }
}