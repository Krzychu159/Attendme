<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center"
  >
    <h1 class="text-5xl font-bold text-gray-800 mb-4">404</h1>
    <p class="text-lg text-gray-600 mb-6">
      Ups! Strona, której szukasz, nie istnieje.
    </p>
    <router-link
      to="/login"
      class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
    >
      Wróć do logowania
    </router-link>
  </div>
</template>
