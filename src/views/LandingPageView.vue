<template>
  <div class="min-h-screen bg-linear-to-br from-green-50 to-emerald-100">
    <!-- Navbar -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-green-600 text-3xl">eco</span>
          <span class="text-2xl font-bold text-gray-800">Eco Tracker</span>
        </div>
        <div class="flex gap-3">
          <router-link 
            to="/login" 
            class="px-6 py-2 text-green-600 font-semibold hover:bg-green-50 rounded-lg transition"
          >
            Login
          </router-link>
          <router-link 
            to="/register" 
            class="px-6 py-2 bg-green-600 text-white font-semibold hover:bg-green-700 rounded-lg transition"
          >
            Get Started
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <div class="max-w-7xl mx-auto px-4 py-20 text-center">
      <h1 class="text-6xl font-bold text-gray-800 mb-6">
        Track Your Household's
        <span class="text-green-600"> Eco-Impact</span>
      </h1>
      <p class="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
        Empower your entire family to make sustainable choices. Track activities, earn rewards, and compete together to save the planet.
      </p>
      
      <div class="flex justify-center gap-4">
        <router-link 
          to="/register" 
          class="px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 transition shadow-lg flex items-center gap-2"
        >
          <span class="material-symbols-outlined">family_home</span>
          Start Your Household
        </router-link>
        <router-link 
          to="/login" 
          class="px-8 py-4 bg-white text-green-600 text-lg font-semibold rounded-lg hover:bg-gray-50 transition shadow-lg border-2 border-green-600 flex items-center gap-2"
        >
          <span class="material-symbols-outlined">login</span>
          Sign In
        </router-link>
      </div>
    </div>
    <!-- Footer -->
    <footer class="bg-gray-800 text-white absolute bottom-0 w-full py-8 mt-20">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <p>&copy; 2025 Eco Tracker. Making sustainability a family affair.</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'LandingPageView'
}
</script>
