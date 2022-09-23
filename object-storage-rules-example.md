rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
    
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
    
      // allow read, write: if false;
     // allow read: if true;
      //allow write: if isSignedIn() && isUserEmailVerified();
      
       allow read: if true;
      allow create: if isSignedIn() && (isManager() || isAdmin());
      allow update: if isSignedIn() &&  (isManager() || isAdmin());
      allow delete: if isSignedIn() && isAdmin();
    }
  }
}