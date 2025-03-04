import { Router } from "express";
import pokemonController from "../controllers/pokemon.controller";

const router = Router();

/**
 * @swagger
 * /api/pokemon:
 *   get:
 *     summary: Get all Pokemon
 *     description: Retrieve a list of all Pokemon
 *     responses:
 *       200:
 *         description: A list of Pokemon
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       types:
 *                         type: array
 *                         items:
 *                           type: string
 *                       height:
 *                         type: number
 *                       weight:
 *                         type: number
 *                       abilities:
 *                         type: array
 *                         items:
 *                           type: string
 *                       imageUrl:
 *                         type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Failed to fetch pokemons
 */
router.get("/", pokemonController.getAll);

/**
 * @swagger
 * /api/pokemon/{id}:
 *   get:
 *     summary: Get Pokemon by ID
 *     description: Retrieve a Pokemon by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The Pokemon ID
 *     responses:
 *       200:
 *         description: A Pokemon object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     types:
 *                       type: array
 *                       items:
 *                         type: string
 *                     height:
 *                       type: number
 *                     weight:
 *                       type: number
 *                     abilities:
 *                       type: array
 *                       items:
 *                         type: string
 *                     imageUrl:
 *                       type: string
 *       400:
 *         description: Invalid ID format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Invalid ID format
 *       404:
 *         description: Pokemon not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Pokemon not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Failed to fetch pokemon
 */
router.get("/:id", pokemonController.getById);

/**
 * @swagger
 * /api/pokemon:
 *   post:
 *     summary: Create a new Pokemon
 *     description: Create a new Pokemon with the provided data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: The Pokemon name
 *     responses:
 *       201:
 *         description: Created Pokemon
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Name is required
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Failed to create pokemon
 */
router.post("/", pokemonController.create);

/**
 * @swagger
 * /api/pokemon/{id}:
 *   put:
 *     summary: Update a Pokemon
 *     description: Update a Pokemon's information
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The Pokemon ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The Pokemon name
 *               types:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Pokemon types
 *               height:
 *                 type: number
 *                 description: Pokemon height
 *               weight:
 *                 type: number
 *                 description: Pokemon weight
 *               abilities:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Pokemon abilities
 *               imageUrl:
 *                 type: string
 *                 description: Pokemon image URL
 *     responses:
 *       200:
 *         description: Updated Pokemon
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     types:
 *                       type: array
 *                       items:
 *                         type: string
 *                     height:
 *                       type: number
 *                     weight:
 *                       type: number
 *                     abilities:
 *                       type: array
 *                       items:
 *                         type: string
 *                     imageUrl:
 *                       type: string
 *       400:
 *         description: Invalid ID format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Invalid ID format
 *       404:
 *         description: Pokemon not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Pokemon not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Failed to update pokemon
 */
router.put("/:id", pokemonController.update);

/**
 * @swagger
 * /api/pokemon/{id}:
 *   delete:
 *     summary: Delete a Pokemon
 *     description: Delete a Pokemon by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The Pokemon ID
 *     responses:
 *       204:
 *         description: No content (successfully deleted)
 *       400:
 *         description: Invalid ID format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Invalid ID format
 *       404:
 *         description: Pokemon not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Pokemon not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Failed to delete pokemon
 */
router.delete("/:id", pokemonController.delete);

export default router;
