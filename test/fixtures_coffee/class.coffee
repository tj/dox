###
# An Animal
# @param {String} name its name
###
class Animal
  constructor: (@name) ->

  ###
  # moves
  # @param {Number} meters move amount
  ###
  move: (meters) ->
    console.log @name + " moved #{meters}m."

  ###
  # create
  # @return {Animal} A new animal instance
  ###
  @create: (name) ->
    return new Animal(name)

Animal.create('Cuffy').move(100)
