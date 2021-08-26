export const messages = {
  fr: {
    security: {
      admin: "Mon espace",
      signIn: "Se connecter",
      signOut: "Se deconnecter",
      signUp: "S'inscrire",
      forgot: "Mot de passe oublié ?",
      needAccount: "Vous n'avez pas de compte ?",
      profile: "Mon compte",
      errors: {
        credentials: "Vos identifiants sont invalides",
      },
    },
    ROLE_USER: "Utilisateur",
    ROLE_RENTER: "Loueur",
    user: {
      lastname: "Nom",
      firstname: "Prénom",
      phone: "Téléphone",
      plainPassword: "Mot de passe",
      confirmPassword: "Confirmer le mot de passe",
      email: "Email",
      roles: "Roles",
      errors: {
        email: "L'email doit être un email valide",
        phone: "Le mobile doit être un numéro de téléphone valide",
        samePassword: "Les mots de passe doivent correspondre",
        currentPassword: "Le mot de passe actuel est invalide",
        plainPassword: "Le mot de passe doit faire plus de 8 caractères",
        noRestaurant: "Vous n'avez pas de restaurant associé à votre compte, merci de contacter un administrateur",
        required: {
          email: "L'email est requis",
          lastname: "Le nom est requis",
          firstname: "Le prénom est requis",
          phone: "Le mobile est requis",
          plainPassword: "Le mot de passe est requis",
          currentPassword: "Le mot de passe actuel est requis",
          confirmPassword: "La confirmation de mot de passe est requise"
        }
      }
    },
    home: {
      header: {
        mainTitle: "Organisez et rejoignez la soirée de vos rêves",
        address: "Saisir une adresse",
        eventName: "Nom de l'évenement",
        peopleMin: "Personnes (min)",
        peopleMax: "Personnes (max)",
        search: "Rechercher",
      },
      footer: {
        description: "Nam nec tellus a odio tincidunt auctor a ornare odio. Sed non mauris vitae erat co nsequat auctor eu in elit.",
        contactUs: "Nous contacter",
        followUs: "Nous suivre"
      }

    },
    event: {
      errors: {
        required: {
          name: "Le nom de l'événement est requis",
          description: "La description est requise"
        },
        peopleLimit: "La limite de personne est requise et doit être un nombre positif",
      },
    },
    form: {
      add: "Ajouter",
      deleteConfirm: "Etes-vous sûr de vouloir supprimer cette item ?",
      validate: "Valider",
      cancel: "Annuler"
    },
    REJECTED: "Rejeté",
    APPROVED: "Approuvé",
    CREATED: "Creé",
    VERIFIED: "Vérifié"
  },
}
